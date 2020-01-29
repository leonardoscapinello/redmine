"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _express = require('express');

var _auth = require('./app/middleware/auth'); var _auth2 = _interopRequireDefault(_auth);
var _SysAidController = require('./app/controllers/SysAidController'); var _SysAidController2 = _interopRequireDefault(_SysAidController);
var _RedmineController = require('./app/controllers/RedmineController'); var _RedmineController2 = _interopRequireDefault(_RedmineController);
var _SchedulerController = require('./app/controllers/SchedulerController'); var _SchedulerController2 = _interopRequireDefault(_SchedulerController);
var _SysAidUserController = require('./app/controllers/SysAidUserController'); var _SysAidUserController2 = _interopRequireDefault(_SysAidUserController);

const routes = new (0, _express.Router)();

/*
    index() // Listagem
    show() // Listagem de único registro
    store() // Cadastro
    update() // Atualização
    delete() // Remoção
*/


routes.use(_auth2.default);

routes.get('/sysaid', _SysAidController2.default.index);
routes.get('/sysaid/:id', _SysAidController2.default.show);
routes.put('/sysaid/:id', _SysAidController2.default.update);

routes.get('/user/:id', _SysAidUserController2.default.show);

routes.get('/redmine', _RedmineController2.default.index);
routes.get('/redmine/:id_issue', _RedmineController2.default.show);
routes.post('/redmine/:id_sr', _RedmineController2.default.store);


exports. default = routes;
