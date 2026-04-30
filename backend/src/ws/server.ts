import express, { type Request, type Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io"; 
import authRouter from "../api/auth";
import hotelsRouter from "../api/hotels";
import bookingsRouter from "../api/bookings";
import { registerChatHandlers } from "../socket/chatSockets";
import { authenticateSocket } from "../middleware/socket-auth.middleware";
import reviewsRouter from '../api/reviews';
import 'dotenv/config';

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://192.168.30.97:5173', 'http://192.168.35.102:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});

registerChatHandlers(io);

app.use(cors({ 
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/auth", authRouter);
app.use("/hotels", hotelsRouter);
app.use("/bookings", bookingsRouter);
app.use('/reviews', reviewsRouter);

app.get("/", (req, res) => {
    res.json({ status: 'ok!!!!!!'});
});

const PORT = 3000;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on http://localhost:' + PORT);
  console.log('Or on your IP: http://192.168.30.97:' + PORT);
  console.log('WebSocket ready');
});