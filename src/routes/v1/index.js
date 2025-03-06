import { Router } from 'express';

import accountRouter from './accountRoutes.js';
import homeRouter from './homeRoutes.js';
import countdownRouter from './countdownRoutes.js';



const v1 = new Router();

// account
v1.use('/account', accountRouter);

// home
v1.use('/', homeRouter);


// app.use("/api/countdown", countdownRoutes(io));


v1.use('/countdown', countdownRouter)

export default v1;