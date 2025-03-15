import { Router } from 'express';

import accountRouter from './accountRoutes.js';
import homeRouter from './homeRoutes.js';
import resultRouter from './resultRoutes.js';
import talpakRouter from './talpakRoutes.js';


const v1 = new Router();

// account
v1.use('/account', accountRouter);

// home
v1.use('/', homeRouter);

// Draw
v1.use('/result', resultRouter);

//Talpak
v1.use('/talpak', talpakRouter);



// v1.use('/latest-drawId', resultRouter);


// app.use("/api/countdown", countdownRoutes(io));


export default v1;