import express from 'express';
import http from 'http';
import cors from 'cors';
import "dotenv/config";
import { connectDB } from "./lib/db.js";
import UserRouter from "./routes/userRoutes.js";
import messageRouter from './routes/messageRoutes.js';
import Message from "./models/message.js";
import { Server } from "socket.io";

// Create an Express application and an HTTP server
const app = express();
const server = http.createServer(app);

// Create a Socket.IO server and allow CORS from the frontend
export const io = new Server(server, {
    cors: {origin:"*"}
});

// store online users
export const userSocketMap = {};

// Socket.IO connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId;
    console.log("User connected: " + userId);

    if (userId) {
        userSocketMap[userId] = socket.id;
    }
    // Emit online users to all clients
    io.emit("onlineUsers", Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("User disconnected: " + userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


// middleware
app.use(express.json({limit: '4mb'}));
app.use(cors());

// routes setup
app.use ("api/status", (req, res) => {
    res.send("Server is running");
});
app.use("/api/auth", UserRouter);
app.use("/api/messages", messageRouter)

// Connect to the database
await connectDB();


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
