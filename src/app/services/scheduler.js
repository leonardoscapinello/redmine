import schedulerConf from '../../config/scheduler';
import request from 'request';

const SchedulerService = function(){

    return {
        
        initialize: async () => {
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

    }


}

export default new SchedulerService();
