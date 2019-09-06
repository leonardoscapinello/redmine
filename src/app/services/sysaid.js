 import sysaidConf from '../../config/sysaid';
 import request from 'request';

const request = require('request');
var session_id = null;

 const SysAidApi = function(){


    return {         
        connect: async () => {
            var options = {
                uri: `${sysaidConf.server.main}${sysaidConf.server.login}`,
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

        getSRs: async () => {
            const url = `${sysaidConf.server.main}${sysaidConf.server.sr}${sysaidConf.queryParams.fields}`;
            console.log(`Connecting to remote server on: ${url}`);
            try{
                var options = {
                    url,
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
            }catch(error){
                console.error(error);
            }       
        },

        getUniqueSR: async (id_sr = 1) => {       
            const url = `${sysaidConf.server.main}${sysaidConf.server.sr}/${id_sr}${sysaidConf.queryParams.fields}`;
            console.log(`Connecting to remote server on: ${url}`);
            var options = {
                url,
                headers: {
                    Cookie: session_id,
                }
            }        
            return new Promise(function (resolve, reject) {
                request(options, function (error, res, body) {
                    if (!error && res.statusCode == 200) {
                        console.log
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