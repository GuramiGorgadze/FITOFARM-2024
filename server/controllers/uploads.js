import cloudinary from "../config/cloudinary.js";

export const uploadProductImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ err: "No file provided" });

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => (error ? reject(error) : resolve(result)),
      );
      stream.end(req.file.buffer);
    });

    res
      .status(200)
      .json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    res.status(500).json({ err: err.message || "Upload failed" });
  }
};
