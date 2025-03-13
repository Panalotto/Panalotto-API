import { Router } from 'express';

import accountRouter from './accountRoutes.js';
import homeRouter from './homeRoutes.js';
import resultRouter from './resultRoutes.js';



const v1 = new Router();

// account
v1.use('/account', accountRouter);

// home
v1.use('/', homeRouter);

// Draw
v1.use('/draw', resultRouter);

v1.use('/latest-drawId', resultRouter);


// app.use("/api/countdown", countdownRoutes(io));


export default v1;