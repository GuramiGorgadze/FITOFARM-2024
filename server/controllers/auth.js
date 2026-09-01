import bcrypt from "bcryptjs";
import { generateToken, clearTokenCookie } from "../utils/generateToken.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ err: "Email and password are required" });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      console.error(
        "ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not set in the environment",
      );
      return res.status(500).json({ err: "Something went wrong" });
    }

    if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) {
      return res.status(401).json({ err: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, adminPasswordHash);
    if (!isMatch) {
      return res.status(401).json({ err: "Invalid email or password" });
    }

    generateToken(res, { email: adminEmail, role: "admin" });

    return res.status(200).json({ data: { email: adminEmail } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ err: "Something went wrong" });
  }
};

export const logout = (req, res) => {
  clearTokenCookie(res);
  return res.status(200).json({ data: "Logged out" });
};

export const me = (req, res) => {
  return res.status(200).json({ data: { email: req.admin.email } });
};
