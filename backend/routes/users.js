import express from "express";
import { contact } from '../controllers/users.js'

const UsersRouter = express.Router();

UsersRouter.post("/contact", contact);

export default UsersRouter;
