import { Router } from 'express';

import authMiddleware from './app/middleware/auth';
import SysAidController from './app/controllers/SysAidController';

const routes = new Router();

routes.use(authMiddleware);


routes.get('/sysaid', SysAidController.index);




export default routes;
