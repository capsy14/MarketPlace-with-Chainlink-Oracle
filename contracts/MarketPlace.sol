// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./SafeMath.sol";
import {Chainlink, ChainlinkClient} from "@chainlink/contracts@1.1.1/src/v0.8/ChainlinkClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts@1.1.1/src/v0.8/shared/access/ConfirmedOwner.sol";
import {LinkTokenInterface} from "@chainlink/contracts@1.1.1/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
struct NFTList {
    uint256 price;
    address seller;
}

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * THIS EXAMPLE USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

contract MarketPlaceLync is ERC721URIStorage , ChainlinkClient, ConfirmedOwner {
    using Chainlink for Chainlink.Request;
    using SafeMath for uint256;

    uint256 private ids = 0;

    uint256 public volume;
    bytes32 private jobId;
    uint256 private fee;
    mapping(uint256 => NFTList) private _listings;
    mapping(uint256 => string) private _tokenURIs;
    event TransferNFT(
        uint256 tokenID,
        address from,
        address to,
        string tokenURI,
        uint256 price
    );
    address public manager;
    event RequestVolume(bytes32 indexed requestId, uint256 volume);

    /**
     * @notice Initialize the link token and target oracle
     *
     * Sepolia Testnet details:
     * Link Token: 0x779877A7B0D9E8603169DdbD7836e478b4624789
     * Oracle: 0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD (Chainlink DevRel)
     * jobId: ca98366cc7314957b8c012c72f05aeeb
     *
     */
    constructor() ERC721("sdf","ksdf") ConfirmedOwner(msg.sender) {
                manager = msg.sender;

        _setChainlinkToken(0x779877A7B0D9E8603169DdbD7836e478b4624789);
        _setChainlinkOracle(0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD);
        jobId = "ca98366cc7314957b8c012c72f05aeeb";
        fee = (1 * LINK_DIVISIBILITY) / 10; // 0,1 * 10**18 (Varies by network and job)
    }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function requestVolumeData() public returns (bytes32 requestId) {
        Chainlink.Request memory req = _buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        // Set the URL to perform the GET request on
        req._add(
            "get",
            "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD"
        );

        // Set the path to find the desired data in the API response, where the response format is:
        // {"RAW":
        //   {"ETH":
        //    {"USD":
        //     {
        //      "VOLUME24HOUR": xxx.xxx,
        //     }
        //    }
        //   }
        //  }
        // request.add("path", "RAW.ETH.USD.VOLUME24HOUR"); // Chainlink nodes prior to 1.0.0 support this format
        req._add("path", "RAW,ETH,USD,PRICE"); // Chainlink nodes 1.0.0 and later support this format

        // Multiply the result by 1000000000000000000 to remove decimals
        int256 timesAmount = 10 ** 18;
        req._addInt("times", timesAmount);

        // Sends the request
        return _sendChainlinkRequest(req, fee);
    }

    /**
     * Receive the response in the form of uint256
     */
    function fulfill(
        bytes32 _requestId,
        uint256 _volume
    ) public recordChainlinkFulfillment(_requestId) {
        emit RequestVolume(_requestId, _volume);
        volume = _volume;
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(_chainlinkTokenAddress());
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }
    function createNFT(string calldata tokenURI) public {
        ids++;
        _safeMint(msg.sender, ids);
        _setTokenURI(ids, tokenURI);
        _tokenURIs[ids] = tokenURI; // Store the token URI in the new mapping
        emit TransferNFT(ids, address(0), msg.sender, tokenURI, 0);
    }

    function listNFT(uint256 tokenID, uint256 priceofNFT) public {
        require(priceofNFT > 0, "NFT price should be greater than zero");
        approve(address(this), tokenID);
        transferFrom(msg.sender, address(this), tokenID);
        _listings[tokenID] = NFTList(priceofNFT, msg.sender);
        emit TransferNFT(tokenID, msg.sender, address(this), "", priceofNFT);
    }

    function buyNFT(uint256 tokenID) public payable {
        NFTList memory listing = _listings[tokenID];
        require(listing.price > 0, "Sorry, this NFT is not listed for sale.");
        uint256 priceInETH = listing.price.mul(1e18);

        require(msg.value >= priceInETH, "Incorrect price");
        transferFrom(address(this), msg.sender, tokenID);

        // Calculating the 10% fee and 90% payment
        uint256 feeAmount = msg.value.mul(10).div(100);
        uint256 payment = msg.value.sub(feeAmount);

        // Transfering the 90% payment to the seller as required
        payable(listing.seller).transfer(payment);

        // Transfering the 10% fee to the contract owner as required
        payable(manager).transfer(feeAmount);

        emit TransferNFT(tokenID, address(this), msg.sender, "", 0);
    }

    //To fetch the current price of the Eth in USD >>>
    function getVolume() public view returns (uint256) {
        return volume;
    }

}
