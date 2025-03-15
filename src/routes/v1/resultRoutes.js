import { Router } from "express";

import resultController from "../../controllers/v1/resultController.js";


const resultRouter = new Router();
const result = new resultController();


resultRouter.post('/', result.insertResult.bind(result));
resultRouter.get('/latest-drawId', result.latestDrawId.bind(result));

resultRouter.get('/latest-result' ,result.latestDrawResult.bind(result));
export default resultRouter;