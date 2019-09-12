import SysAidApi from './sysaid';
import redmineConf from '../../config/redmine';
import authConf from '../../config/auth';
import request from 'request';

var session_id = null;

const RedmineApi = function(){

    return {
        getIssues: async () => {
            const url = `${redmineConf.server}/issues.json${redmineConf.filters}`;            
            //console.log(`Connecting to remote server on: ${url}`);
            var options = {
                url,
                method: 'GET',
                headers: {
                    'X-Redmine-API-Key': `${redmineConf.api_key}`
                }
            };            
            return new Promise(function (resolve, reject) {
                request(options, function (error, res, body) {
                    if (!error && res.statusCode == 200) {
                        resolve(JSON.parse(body));
                    } else {
                        console.log(error);
                        reject(error);
                    }
                });
            });
        },
        getIssue: async (id_issue = 1) => {
            const url = `${redmineConf.server}/issues/${id_issue}.json`;            
            //console.log(`Connecting to remote server on: ${url}`);
            var options = {
                url,
                method: 'GET',
                headers: {
                    'X-Redmine-API-Key': `${redmineConf.api_key}`
                }
            };            
            return new Promise(function (resolve, reject) {
                request(options, function (error, res, body) {
                    if (!error && res.statusCode == 200) {
                        resolve(JSON.parse(body));
                    } else {
                        console.log(error);
                        reject(error);
                    }
                });
            });
        },

        getSysAidRequest: async (id_sr) => {
            try{
                const url = `http://localhost:${authConf.serverPort}/sysaid/${id_sr}`;            
                console.log(`Connecting to remote server on: ${url}`);
                var options = {
                    url,
                    method: 'GET',
                    headers: {
                        authorization: `${authConf.secret}`
                    }
                };            
                return new Promise(function (resolve, reject) {
                    request(options, function (error, res, body) {
                        if (!error && res.statusCode == 200) {   
                            const info = JSON.parse(body).response.info;
                            var serviceRecordValues = [];
                            for(var item of info) {
                                const { key, value } = item;
                               serviceRecordValues.push( {key, value} );
                            }
                            resolve(serviceRecordValues);
                        } else {
                            console.log(error);
                            reject(error);
                        }
                    });
                });
            }catch(err){
                console.log(err);
            }
        },

        getSysAidUser: async (id_user) => {
            try{
                const url = `http://localhost:${authConf.serverPort}/user/${id_user}`;            
                console.log(`Connecting to remote server on: ${url}`);
                var options = {
                    url,
                    method: 'GET',
                    headers: {
                        authorization: `${authConf.secret}`
                    }
                };            
                return new Promise(function (resolve, reject) {
                    request(options, function (error, res, body) {
                        if (!error && res.statusCode == 200) {   
                            const response = JSON.parse(body).response;
                            const info = response.info;
                            var userValues = [];
                            userValues.push({ key: 'id', value: response.id });
                            userValues.push({ key: 'name', value: response.name });
                            userValues.push({ key: 'isAdmin', value: response.isAdmin });
                            userValues.push({ key: 'isSysAidAdmin', value: response.isSysAidAdmin });
                            userValues.push({ key: 'isManager', value: response.isManager });
                            for(var item of info) {
                                const { key, value } = item;
                                userValues.push( {key, value} );
                            }
                            resolve(userValues);
                        } else {
                            console.log(error);
                            reject(error);
                        }
                    });
                });
            }catch(err){
                console.log(err);
            }
        },

        createIssue: async (id_sr) => {

            try{

                const sysaidRecords = await RedmineApi().getSysAidRequest(id_sr).then(response => {
                    return response;
                });
                var id_user = sysaidRecords.filter(function(item) {
                    return item.key == "request_user";
                });

                const sysaidUserObject = await RedmineApi().getSysAidUser(id_user[0].value).then(response => {
                    return response;
                }).catch(error => {console.log(error)});

                const srTitle = sysaidRecords.filter(function(item) { return item.key == "title";  });
                const srDescription = sysaidRecords.filter(function(item) { return item.key == "description";  });
                const srNotes = sysaidRecords.filter(function(item) { return item.key == "notes";  });
                const srCustNotes = sysaidRecords.filter(function(item) { return item.key == "cust_notes";  });
                const srPriority = sysaidRecords.filter(function(item) { return item.key == "priority";  });
                
                const sysaidUser = sysaidUserObject.filter(function(item) { return item.key == "login_user";  });
                const userName = sysaidUserObject.filter(function(item) { return item.key == "calculated_user_name";  });
                const userMail = sysaidUserObject.filter(function(item) { return item.key == "email_address";  });
                const userPhone = sysaidUserObject.filter(function(item) { return item.key == "phone";  });
                const userCell = sysaidUserObject.filter(function(item) { return item.key == "cell_phone";  });
                
                var srContact = "\n Nome Completo: " + userName[0].value;
                    srContact = srContact + "\n Login de rede: " + sysaidUser[0].value;
                    srContact = srContact + "\n E-mail: " + userMail[0].value;
                    srContact = srContact + "\n Telefone: " + userPhone[0].value;
                    srContact = srContact + " Celular: " + userCell[0].value;

                var issuePriority = 4; 
                if(parseInt(srPriority[0].value) === 2) issuePriority = 4;
                if(parseInt(srPriority[0].value) === 3) issuePriority = 3;
                if(parseInt(srPriority[0].value) === 4) issuePriority = 2;
                if(parseInt(srPriority[0].value) === 5) issuePriority = 1;


                var json = JSON.parse(JSON.stringify(
                    {
                        "issue": {
                          "project_id": 142,
                          "subject": srTitle[0].value,
                          "priority_id": issuePriority,
                          "tracker_id": 10,
                          "description": srDescription[0].value,
                          "notes": srNotes[0].value,
                          "custom_fields":
                                [
                                    {"value":srContact,"id": 9}, //contato
                                    {"value":"Invalid","id": 10}  //pendência
                                ]
                        }
                    }
                ));  


                var options = {
                    uri: `${redmineConf.server}/issues.json`,
                    method: 'POST',
                    headers: {
                        'X-Redmine-API-Key': `${redmineConf.api_key}`
                    },
                    json
                };   


                

                //console.log(JSON.stringify(json));
    
                return new Promise(function (resolve, reject) {
                    request(options, function (error, res, body) {
                        if (!error && (res.statusCode >= 200 && res.statusCode < 300)) {                            
                            const resp = body;
                            SysAidApi.LinkSysAid(id_sr, resp.issue.id).catch(error => {console.log(error)});
                            resolve(resp);
                        } else {
                            console.log(body);
                            reject(error);
                        }
                    });
                });
            }catch(error){
                console.log(error);
            }
        },
        
        
    }
}

export default new RedmineApi();
