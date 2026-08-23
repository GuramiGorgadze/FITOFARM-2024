import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import UsersRouter from "./routes/users.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CLIENT_URLS || 'http://localhost:5173').split(',');

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use("/api/users", UsersRouter);

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
  });
};

startServer();