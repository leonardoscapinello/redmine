import schedulerConf from '../../config/scheduler';
import authConf from '../../config/auth';
import sysaidConf from '../../config/sysaid';
import request from 'request';
import schedule from 'node-schedule';
import dateformat from 'dateformat';

let interations = 0;
var serviceRecords = [];
var issueRecords = [];

const SchedulerService = function(){

    const execute = (async () => { 
        
        await SchedulerService().getSR();                
        await SchedulerService().issuesPush();
        await SchedulerService().checkChanges();
                
    });

    return {
        
        main: async () => {
            console.log(`***** Starting Scheduler on ${dateformat(new Date(), "dd/mm/yyyy HH:MM:ss")}`);
            var j = schedule.scheduleJob('*/1 * * * *', function(){
                console.time('└─ Scheduler execution time');
                if(interations === 0){
                    console.log(`Setting scheduler runtime to full time.`);
                }else{                    
                    console.log(`------------------------`);
                }
                interations++; 
                console.log(`Job execution number: ${interations}.`);
                execute()
                .then(response => { 
                    console.log(`└─ Job ${interations} was successfully executed.`);
                    console.log(`└─ Execution date ${dateformat(new Date(), "dd/mm/yyyy HH:MM:ss")}`);
                    console.timeEnd('└─ Scheduler execution time');
                }).catch(error => { 
                    console.log(`└─ Job ${interations} returned error while executing.`);
                    console.log(`└─ Error:`);
                    console.error(error);
                });
            });
        },

        getSR: async () => {
            serviceRecords = [];
            var options = {
                url: `http://localhost:${authConf.serverPort}/sysaid`,
                method: 'GET',
                headers: {
                    authorization: `${authConf.secret}`
                }
            }              
            return new Promise(function (resolve, reject) {
                request(options, function (error, res, body) {
                    if (!error && res.statusCode == 200) {
                        const srs = JSON.parse(body);                        
                        const response = srs['response'];
                        for(let i =0;i < response.length;i++){
                            const { id, info } = response[i];
                            var status = "";
                            var issueId = "";
                            var statusClass = "";
                            for(let x = 0; x < info.length; x++){
                                if(info[x].key === "status"){
                                    status = info[x].value;
                                    statusClass = info[x].valueClass;
                                }
                                if(info[x].key === sysaidConf.fields.issueId){
                                    issueId = info[x].value;
                                }
                            }
                            if(statusClass === 0){ 
                                if(issueId !== null && issueId !== ""){ 
                                    serviceRecords.push({id, status, issueId});
                                }
                            }
                        }
                        resolve(serviceRecords);
                    } else {
                        reject(error);
                    }
                });
            });    
        },

        getIssues : async (issueId) => {  
            return new Promise(function(resolve, reject) { 
                var options = {
                    url: `http://localhost:${authConf.serverPort}/redmine/${issueId}`,
                    method: 'GET',
                    headers: {
                        authorization: `${authConf.secret}`
                    }
                }    
                request(options, function(error, res, body) {
                    if (!error && res.statusCode == 200) {
                        const issues = JSON.parse(body);                     
                        const { issue } = issues.response;
                        const { id, status, custom_fields  } = issue;
                        resolve({id, status, custom_fields});
                    } else {
                        reject(error);
                    }
                });
            }); 
        },

        issuesPush: async () => {
            // `map` over the serviceRecords and return a getIssues promise for each issueId
            const promises = serviceRecords.map(({ issueId }) => SchedulerService().getIssues(issueId));          
            // Wait for all the promises to resolve
            const data = await Promise.all(promises);          
            // Loop over the resolved promises and log the issueId
            data.forEach((issueId) => {
                issueRecords.push(issueId);
            });
        },

        checkChanges : async () => {  
            
        },

        
    }


}

export default new SchedulerService();
