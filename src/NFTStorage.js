import formidable from "formidable";
import { readFileSync, unlinkSync } from "fs";
import { NFTStorage, File } from "nft.storage";
import { tmpdir } from "os";

const client = new NFTStorage({ token: `${process.env.NFT_STORAGE_KEY}` });

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(403).json({ error: `Unsupported method ${req.method}` });
  }
  try {
    const data = await new Promise((resolve, reject) => {
      const form = formidable({ multiples: true, uploadDir: tmpdir() });
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ ...fields, ...files });
      });
    });

    const { filepath, originalFilename = "image", mimetype = "image" } = data.image;
    const buffer = readFileSync(filepath);
    const arraybuffer = Uint8Array.from(buffer).buffer;
    const file = new File([arraybuffer], originalFilename, { type: mimetype });

    const metadata = await client.store({
      name: data.name,
      description: data.description,
      image: file,
    });

    unlinkSync(filepath);

    res.status(201).json({ uri: metadata.url });
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
