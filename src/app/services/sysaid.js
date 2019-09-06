 import sysaidConf from '../../config/sysaid';
 import request from 'request';

const request = require('request');
var session_id = null;

 const SysAidApi = function(){


    return {         
        connect: async () => {
            var options = {
                uri: `${sysaidConf.server.login}`,
                method: 'POST',
                json: {
                    "user_name": ".\\sysaid",
                    "password": "power@sysaid",
                }
            };            
            return new Promise(function (resolve, reject) {
                request(options, function (error, res, body) {
                    if (!error && res.statusCode == 200) {
                        session_id = res.headers['set-cookie'][0];
                        resolve(res.headers['set-cookie'][0]);
                    } else {
                        session_id = null;
                        reject(error);
                    }
                });
            });
        },

        getSRs: async (id_sr = 1) => {            
            var options = {
                url: `${sysaidConf.server.sr}/${id_sr}`, 
                headers: {
                    Cookie: session_id
                }
            }        
            return new Promise(function (resolve, reject) {
                request(options, function (error, res, body) {
                    if (!error && res.statusCode == 200) {
                        resolve(JSON.parse(body));
                    } else {
                        reject(error);
                    }
                });
            });           
        }

    }
 }

 export default new SysAidApi();