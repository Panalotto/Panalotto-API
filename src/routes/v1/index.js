import { Router } from 'express';

import accountRouter from './accountRoutes.js';
import homeRouter from './homeRoutes.js';
import resultRouter from './resultRoutes.js';
import talpakRouter from './talpakRoutes.js';
import winnerRouter from './winningRoutes.js';


const v1 = new Router();



// account
v1.use('/account', accountRouter);

// home
v1.use('/', homeRouter);

// Draw
v1.use('/result', resultRouter);

//Talpak
v1.use('/talpak', talpakRouter);

v1.use("/winner", winnerRouter);




export default v1;