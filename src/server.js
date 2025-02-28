// import express from 'express';
// import bodyParser from 'body-parser';
// import 'dotenv/config.js';
// import cors from 'cors';
// import { WebSocketServer } from 'ws';
// import v1 from './routes/v1/index.js';
// import './core/database.js';
// import morgan from 'morgan';

// const app = express();
// const port = process.env.PORT || 8080;

// // Middleware
// app.use(morgan('combined'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));



// app.use('/v1', cors(), v1);

// const server = app; 

// const wss = new WebSocketServer({ noServer: true });

// const checkWebSocketStatus = () => {
//     if (wss.clients.size > 0) {
//         console.log(`🟢 WebSocket is running with ${wss.clients.size} active connection(s).`);
//     } else {
//         console.log('🟡 WebSocket is running but no active connections.');
//     }
// };

// setInterval(checkWebSocketStatus, 10000);

// export { server, port, wss };
