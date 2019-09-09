import { Router } from 'express';

import authMiddleware from './app/middleware/auth';
import SysAidController from './app/controllers/SysAidController';

const routes = new Router();

routes.use(authMiddleware);


routes.get('/sysaid', SysAidController.index);
routes.get('/sysaid/:id', SysAidController.show);
routes.put('/sysaid/:id', SysAidController.update);




export default routes;
