import { Router } from 'express';

import AccountController from '../../controllers/v1/accountController.js';

import authorization from '../../middlewares/authorization.js';
import authentication from '../../middlewares/authentication.js'


const accountRouter = new Router();
const account = new AccountController();

accountRouter.use(authorization);

// Login
accountRouter.post('/login',account.login.bind(account));

//Logout 
accountRouter.post('/logout', account.logout.bind(account));

//

//Transaction
accountRouter.post('/cashIn', account.addMoney.bind(account));

accountRouter.delete('/cashOut', account.releaseMoney.bind(account));


// create Account
accountRouter.post('/',account.create.bind(account));

// Get Profile
accountRouter.get('/', authentication, account.profile.bind(account));

// Get Profile
//accountRouter.get('/', authentication, account.bind(account));


export default accountRouter;