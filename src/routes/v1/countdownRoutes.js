import { Router } from "express";
import CountdownController from "../../controllers/v1/countdownController.js";

import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js'


const countdownRouter = new Router();
const timer = new CountdownController();

countdownRouter.use(authorization);

countdownRouter.get('/', authentication, timer.getCountdown.bind(timer));

export default countdownRouter;