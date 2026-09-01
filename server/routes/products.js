import express from "express";
import { getProducts, getProductById, createProduct } from "../controllers/products.js";

const ProductsRouter = express.Router();

ProductsRouter.get("/", getProducts);
ProductsRouter.get("/:id", getProductById);
ProductsRouter.post('/', createProduct)

export default ProductsRouter;
