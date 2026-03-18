import express, { type Request, type Response } from "express";
import cors from "cors";
import authRouter from "../api/auth";
import hotelsRouter from "../api/hotels";
import bookingsRouter from "../api/bookings";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/hotels", hotelsRouter);
app.use("/api/bookings", bookingsRouter);

app.get("/", (req, res) => {
    res.json({ status: 'ok!!!!!!'});
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});