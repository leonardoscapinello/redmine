import { Router } from 'express';

import authMiddleware from './app/middleware/auth';
import SysAidController from './app/controllers/SysAidController';

const routes = new Router();

routes.use(authMiddleware);


routes.get('/sysaid/:id', SysAidController.index);




export default routes;
