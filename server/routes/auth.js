import express from "express";
import rateLimit from "express-rate-limit";
import { login, logout, me } from "../controllers/auth.js";
import { protect } from "../middleware/authMiddleware.js";

const AuthRouter = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { err: "Too many login attempts, please try again in 15 minutes" },
});

AuthRouter.post("/login", loginLimiter, login);
AuthRouter.post("/logout", logout);
AuthRouter.get("/me", protect, me);

export default AuthRouter;
