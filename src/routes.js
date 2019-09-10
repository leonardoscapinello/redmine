import { Router } from 'express';

import authMiddleware from './app/middleware/auth';
import SysAidController from './app/controllers/SysAidController';
import RedmineController from './app/controllers/RedmineController';
import SchedulerController from './app/controllers/SchedulerController';

const routes = new Router();

/*
    index() // Listagem
    show() // Listagem de único registro
    store() // Cadastro
    update() // Atualização
    delete() // Remoção
*/


routes.use(authMiddleware);

routes.get('/sysaid', SysAidController.index);
routes.get('/sysaid/:id', SysAidController.show);
//routes.put('/sysaid/:id', SysAidController.update);

routes.get('/redmine', RedmineController.index);
routes.get('/redmine/:id_issue', RedmineController.show);
routes.post('/redmine', RedmineController.store);


export default routes;
