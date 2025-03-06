import http from "http";
import express from "express";
import { WebSocketServer } from "ws";
import path from "path";

const publicPath = "C:/Users/Administrator/Downloads/PortableGit/Panalotto-SPA/public";


const ports = [9000];

ports.forEach((port) => {
    const app = express();
    const server = http.createServer(app);
    server.listen(port, () => console.log(`Server Started at Port: ${port}`));


    console.log("Serving index.html from:", path.join(publicPath, "index.html"));

    
    app.use(express.static(publicPath));
    app.use(express.static("public", { extensions: ["js"] }));


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
