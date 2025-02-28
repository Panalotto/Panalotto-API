import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import 'dotenv/config.js';
import v1 from './routes/v1/index.js';
import './core/database.js';

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/v1', cors(), v1);


// Start HTTP API
app.listen(port, () => {
    console.log(`🚀 API running on http://localhost:${port}`);
});
