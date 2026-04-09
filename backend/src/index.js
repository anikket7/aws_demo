import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { transactionsRouter } from "./routes/transactions.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionsRouter);

app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    return res.status(500).json({ message: "server error" });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is required");
}

await mongoose.connect(MONGO_URI).then(() => {
    console.log("connected to mongo");
});

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
