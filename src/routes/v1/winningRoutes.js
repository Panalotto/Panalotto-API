import { Router } from 'express';

import WinnerController from '../../controllers/v1/winnerController.js';

const winnerRouter = new Router();
const winner = new WinnerController();


winnerRouter.get('/get-win' ,winner.getAllwinners.bind(winner));
winnerRouter.get('/get-winner', winner.getthewinner.bind(winner));



export default winnerRouter;
