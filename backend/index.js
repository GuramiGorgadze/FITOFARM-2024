import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import UsersRouter from "./routes/users.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
  : "*";

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/users", UsersRouter);

app.use((req, res) => {
  res.status(404).json({ err: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ err: "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});