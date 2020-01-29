"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable no-console */
var _nodewindows = require('node-windows'); var _nodewindows2 = _interopRequireDefault(_nodewindows);
var _windows = require('./config/windows'); var _windows2 = _interopRequireDefault(_windows);

const { Service } = _nodewindows2.default;

const svc = new Service({
  // Nome do servico
  name: `${_windows2.default.name}`,
  // Descricao que vai aparecer no Gerenciamento de serviço do Windows
  description: `${_windows2.default.description}`,
  // caminho absoluto do seu script
  script: `${_windows2.default.absolutePath}\\src\\${_windows2.default.script}`,
});

svc.on('uninstall', () => {
  console.log(`*  Redmine Service Removed Successfully`);
  console.log(`└─ Service name: ${_windows2.default.name}.`);
  svc.start();
});

svc.uninstall();
