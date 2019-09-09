import { Router } from 'express';

import authMiddleware from './app/middleware/auth';
import SysAidController from './app/controllers/SysAidController';
import RedmineController from './app/controllers/RedmineController';

const routes = new Router();

routes.use(authMiddleware);

routes.get('/sysaid', SysAidController.index);
routes.get('/sysaid/:id', SysAidController.show);
routes.put('/sysaid/:id', SysAidController.update);

routes.get('/redmine', RedmineController.index);
routes.get('/redmine/:id_issue', RedmineController.show);
//routes.put('/redmine/:id', RedmineController.update);


export default routes;
