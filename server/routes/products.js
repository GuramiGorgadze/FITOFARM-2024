import express from "express";
import { getProducts, getProductByHandle, createProduct } from "../controllers/products.js";

const ProductsRouter = express.Router();

ProductsRouter.get("/", getProducts);
ProductsRouter.get('/:handle', getProductByHandle);
ProductsRouter.post('/', createProduct)

export default ProductsRouter;
