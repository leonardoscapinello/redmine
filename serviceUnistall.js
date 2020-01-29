/* eslint-disable no-console */
import Windows from 'node-windows';
import serviceConf from './src/config/windows';

const { Service } = Windows;

const svc = new Service({
  // Nome do servico
  name: `${serviceConf.name}`,
  // Descricao que vai aparecer no Gerenciamento de serviço do Windows
  description: `${serviceConf.description}`,
  // caminho absoluto do seu script
  script: `${serviceConf.absolutePath}${serviceConf.script}`,
});

svc.on('uninstall', () => {
  console.log(`*  Redmine Service Removed Successfully`);
  console.log(`└─ Service name: ${serviceConf.name}.`);
  svc.start();
});

svc.uninstall();
