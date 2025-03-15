import { Router } from 'express';

import TalpakController from '../../controllers/v1/talpakController.js';

const talpakRouter = new Router();
const talpak = new TalpakController();


talpakRouter.post('/enter-na'  ,talpak.talpaksalotto.bind(talpak));

talpakRouter.get('/get-pot' ,talpak.getAllTalpak.bind(talpak));

export default talpakRouter;