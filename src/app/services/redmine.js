import redmineConf from '../../config/redmine';
import request from 'request';

var session_id = null;

const RedmineApi = function(){

    return {
        getIssues: async () => {
            var options = {
                uri: `${redmineConf.server}/issues.json${redmineConf.filters}`,
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
            var options = {
                uri: `${redmineConf.server}/issues/${id_issue}.json`,
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
        createIssue: async (json) => {
            var options = {
                uri: `${redmineConf.server}/issues.json`,
                method: 'POST',
                headers: {
                    'X-Redmine-API-Key': `${redmineConf.api_key}`
                },
                json
            };   
            console.log('options', options);  
            console.log('json', json);         
            /*return new Promise(function (resolve, reject) {
                request(options, function (error, res, body) {
                    if (!error && res.statusCode == 200) {
                        resolve(JSON.parse(body));
                    } else {
                        console.log(error);
                        reject(error);
                    }
                });
            });
            */
        }

    }


}

export default new RedmineApi();
