import schedulerConf from '../../config/scheduler';
import authConf from '../../config/auth';
import sysaidConf from '../../config/sysaid';
import request from 'request';
import schedule from 'node-schedule';
import dateformat from 'dateformat';

let interations = 0;
var serviceRecords = [];

const SchedulerService = function(){

    return {
        
        initialize: async () => {
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

                SchedulerService().execute()
                .then(response => { 
                    console.log(`└─ Job ${interations} was successfully executed.`);
                    console.log(`└─ Execution date ${dateformat(new Date(), "dd/mm/yyyy HH:MM:ss")}`);
                    console.timeEnd('└─ Scheduler execution time');
                }).catch(error => { 
                    console.log(`└─ Job ${interations} returned error while executing.`);
                });
                
            });
            
        },

        execute: async () => {             
            return SchedulerService()
            .getRecords2Sync()
            .catch(error => {console.log(error)}); 
        },

        getRecords2Sync: async () => {
            serviceRecords = [];
            var options = {
                url: `http://localhost:3031/sysaid`,
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
                        

                        console.log(serviceRecords);
                        
                        resolve(serviceRecords);
                    } else {
                        //console.log(error);
                        reject(error);
                    }
                });
            });    
        }



    }


}

export default new SchedulerService();
