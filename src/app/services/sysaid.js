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
                    'user_name': `${sysaidConf.user_name}`,
                    'password': `${sysaidConf.password}`,
                }
            };            
            return new Promise(function (resolve, reject) {
                request(options, function (error, res, body) {
                    if (!error && res.statusCode == 200) {
                        session_id = res.headers['set-cookie'][0];
                        console.log('Successfully Authenticated on SysAid');
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
            //console.log(`Connecting to remote server on: ${url}`);
            try{
                var options = {
                    url,
                    method: 'GET',
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
            //console.log(`Connecting to remote server on: ${url}`);
            var options = {
                url,
                method: 'GET',
                headers: {
                    Cookie: session_id,
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
        },

        updateSR: async (id = 1, info = {}) => {          
            try{       
                const url = `${sysaidConf.server.main}${sysaidConf.server.sr}/${id}`;
                //console.log(`Connecting to remote server on: ${url}`);
                const { status, cust_notes, solution } = info; 

                if(cust_notes !== "" && cust_notes !== undefined){
                    var requestData = JSON.parse(JSON.stringify(
                        {
                            id,
                            'info':[
                                {'key':'status', 'value': `${status}`},
                                {'key':'solution', 'value': `${solution}`},
                                {"key":"notes","value":[
                                    {"userName":"sysaid_admin","createDate":Date.now(),"text":`${cust_notes}`}                            
                                ]},
                            ] 
                        }
                    ));                                  
                }else{
                    var requestData = JSON.parse(JSON.stringify(
                        {
                            id,
                            'info':[
                                {'key':'status', 'value': `${status}`},
                                {'key':'solution', 'value': `${solution}`}
                            ] 
                        }
                    ));  
                }
                var options = JSON.parse(JSON.stringify({
                    url,
                    method: 'PUT',
                    headers: {
                        Cookie: session_id,
                    },
                    json: requestData
                }));  
                return new Promise(function (resolve, reject) {
                    request(options, function (error, res, body) {
                        if (!error && res.statusCode == 200) {               
                            resolve(body);
                        } else {
                            reject(error);
                        }
                    });
                });   
            }catch(err){
                console.log(err);
            } 
        },

        LinkSysAid: async (id, id_issue) => {
            const url = `${sysaidConf.server.main}${sysaidConf.server.sr}/${id}`;   
            console.log(`└─ Service request #${id} has been linked to Redmine issue #${id_issue}`);           
            var requestData = JSON.parse(JSON.stringify(
                {
                    id,
                    'info':[
                        {'key':`${sysaidConf.fields.issueId}`, 'value': `${id_issue}`},                               
                    ] 
                }
            ));  
            var options = JSON.parse(JSON.stringify({
                url,
                method: 'PUT',
                headers: {
                    Cookie: session_id,
                },
                json: requestData
            }));  
            return new Promise(function (resolve, reject) {
                request(options, function (error, res, body) {
                    if (!error && res.statusCode == 200) {               
                        resolve(body);
                    } else {
                        console.log(body);
                        reject(error);
                    }
                });
            });        
        },


        getUser: async (id_user) => {
            const url = `${sysaidConf.server.main}${sysaidConf.server.user}/${id_user}`;
            //console.log(url);
            try{
                var options = {
                    url,
                    method: 'GET',
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
        }


    }
 }

 export default new SysAidApi();