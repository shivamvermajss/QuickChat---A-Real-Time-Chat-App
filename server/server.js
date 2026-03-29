import express from 'express';
import http from 'http';
import cors from 'cors';
import "dotenv/config";
import { connectDB } from "./lib/db.js";

// Create an Express application and an HTTP server
const app = express();
const server = http.createServer(app);

// middleware
app.use(express.json({limit: '4mb'}));
app.use(cors());

app.use ("api/status", (req, res) => {
    res.send("Server is running");
});

// Connect to the database
await connectDB();


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
