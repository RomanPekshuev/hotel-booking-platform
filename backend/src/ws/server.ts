import express, { type Request, type Response } from "express";
import cors from "cors";
import { createServer } from "http";           // ← 1. ИМПОРТ: HTTP сервер
import { Server } from "socket.io";            // ← 2. ИМПОРТ: Socket.IO
import authRouter from "../api/auth";
import hotelsRouter from "../api/hotels";
import bookingsRouter from "../api/bookings";
import { registerChatHandlers } from "../socket/chatSockets";  // ← 3. ИМПОРТ: ваши обработчики чата
import { authenticateSocket } from "../middleware/socket-auth.middleware";  // ← 4. ИМПОРТ: аутентификация сокетов

const app = express();

// ← 5. СОЗДАЁМ HTTP сервер (обёртка над Express)
const httpServer = createServer(app);

// ← 6. ИНИЦИАЛИЗИРУЕМ Socket.IO с CORS
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://192.168.30.97:5173', 'http://192.168.35.102:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  }
});

// ← 7. MIDDLEWARE: авторизация сокетов (будем создавать)
// io.use(authenticateSocket);

// ← 8. РЕГИСТРИРУЕМ обработчики чата
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

app.get("/", (req, res) => {
    res.json({ status: 'ok!!!!!!'});
});

const PORT = 3000;

// ← 9. ЗАПУСКАЕМ httpServer (НЕ app.listen!)
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log('Server running on http://localhost:' + PORT);
  console.log('Or on your IP: http://192.168.30.97:' + PORT);
  console.log('WebSocket ready');
});