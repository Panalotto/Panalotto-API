import { Router } from "express";

import resultController from "../../controllers/v1/resultController.js";


const resultRouter = new Router();
const result = new resultController();


resultRouter.post('/', result.insertResult.bind(result));
resultRouter.get('/', result.latestDrawId.bind(result));
export default resultRouter;