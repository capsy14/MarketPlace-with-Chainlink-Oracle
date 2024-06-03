import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-list">

        <li className="navbar-item">
          <Link to="/createNFT" className="navbar-link">Create NFTs</Link>
        </li>
        <li className="navbar-item">
          <Link to="/OwnedNFT" className="navbar-link">My NFTs</Link>
        </li>
        <li className="navbar-item">
          <Link to="/Listed&OwnedNFT" className="navbar-link">Listed Owned NFTs</Link>
        </li>
        <li className="navbar-item">
          <Link to="/" className="navbar-link">BuyNFTs</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
