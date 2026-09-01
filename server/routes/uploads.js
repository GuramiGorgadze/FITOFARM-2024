import express from "express";
import upload from "../middleware/upload.js";
import { uploadProductImage } from "../controllers/uploads.js";

const UploadRouter = express.Router();

UploadRouter.post("/", upload.single("image"), uploadProductImage);

export default UploadRouter;
