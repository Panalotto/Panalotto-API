import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Manually define the correct public directory
const publicPath = "C:/Users/Administrator/Downloads/PortableGit/Panalotto-SPA/public"; // Correct public folder

// Convert `process.env.Master_Port` into an array
const ports = process.env.Master_Port ? process.env.Master_Port.split(",").map(Number) : [5000];

ports.forEach((port) => {
    const app = express();
    const server = http.createServer(app);
    server.listen(port, () => console.log(`Server Started at Port: ${port}`));

    // Log the correct path for debugging
    console.log("Serving index.html from:", path.join(publicPath, "index.html"));

    // ✅ Serve all static files correctly
    app.use(express.static(publicPath));
    app.use(express.static("public", { extensions: ["js"] }));

    // Serve SPA index.html
    app.get("*", (req, res) => {
        res.sendFile(path.join(publicPath, "index.html"));
    });

    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        console.log(`Client connected to port ${port}`);

        ws.on("message", (message) => {
            console.log(`Received on ${port}:`, message.toString());
        });

        ws.send(JSON.stringify({ type: "WELCOME", data: `Connected to port ${port}` }));
    });
});
