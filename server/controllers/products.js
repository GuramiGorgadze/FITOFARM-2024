import Products from "../models/products.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Products.find();

    res.status(200).json({ data: products });
  } catch (err) {
    res.status(500).json({ err: err });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ err: "Product not found" });
    }

    res.status(200).json({ data: product });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
};