import { Router } from 'express';

import accountRouter from './accountRoutes.js';
import homeRouter from './homeRoutes.js';

const v1 = new Router();

// account
v1.use('/account', accountRouter);

// home
v1.use('/', homeRouter);

export default v1;