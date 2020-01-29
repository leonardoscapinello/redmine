"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _scheduler = require('../../config/scheduler'); var _scheduler2 = _interopRequireDefault(_scheduler);
var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);
var _sysaid = require('../../config/sysaid'); var _sysaid2 = _interopRequireDefault(_sysaid);
var _request = require('request'); var _request2 = _interopRequireDefault(_request);
var _nodeschedule = require('node-schedule'); var _nodeschedule2 = _interopRequireDefault(_nodeschedule);
var _dateformat = require('dateformat'); var _dateformat2 = _interopRequireDefault(_dateformat);

let interations = 0;
var serviceRecords = [];
var issueRecords = [];

var updateQueue = [];

const SchedulerService = function(){

    const execute = (async () => { 
        
        await SchedulerService().getSR();                
        await SchedulerService().issuesPush();
        await SchedulerService().organizeListIndex();
        await SchedulerService().update();
                

    });

    return {
        
        main: async () => {
            console.log(`*  Starting Scheduler on ${_dateformat2.default.call(void 0, new Date(), "dd/mm/yyyy HH:MM:ss")}`);
            console.log(`└─ Scheduler timer is set to ${_scheduler2.default.timer.minutes} minute(s)`);
            var j = _nodeschedule2.default.scheduleJob(`*/${_scheduler2.default.timer.minutes} * * * *`, function(){
                console.time('└─ Scheduler execution time');
                if(interations === 0){
                    console.log(`└─ Setting scheduler runtime to full time.`);
                }else{                    
                    console.log(`------------------------`);
                }
                interations++; 
                console.log(`└─ Job execution number: ${interations}.`);
                execute()
                .then(response => { 
                    console.log(`└─ Job ${interations} was successfully executed.`);
                    console.log(`└─ Execution date ${_dateformat2.default.call(void 0, new Date(), "dd/mm/yyyy HH:MM:ss")}`);
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
                url: `http://localhost:${_auth2.default.serverPort}/sysaid`,
                method: 'GET',
                headers: {
                    authorization: `${_auth2.default.secret}`
                }
            }              
            return new Promise(function (resolve, reject) {
                _request2.default.call(void 0, options, function (error, res, body) {
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
                                if(info[x].key === _sysaid2.default.fields.issueId){
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
                    url: `http://localhost:${_auth2.default.serverPort}/redmine/${issueId}`,
                    method: 'GET',
                    headers: {
                        authorization: `${_auth2.default.secret}`
                    }
                }    
                _request2.default.call(void 0, options, function(error, res, body) {
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
            issueRecords = [];
            // `map` over the serviceRecords and return a getIssues promise for each issueId
            const promises = serviceRecords.map(({ issueId }) => SchedulerService().getIssues(issueId));          
            // Wait for all the promises to resolve
            const data = await Promise.all(promises);          
            // Loop over the resolved promises and log the issueId
            data.forEach((issueId) => {
                issueRecords.push(issueId);
            });
        },

        organizeListIndex : async () => {    
            updateQueue = [];          
            for(let sysaid = 0;sysaid < serviceRecords.length;sysaid++){
                const sysaid_issueId = serviceRecords[sysaid].issueId;
                for(let redmine = 0;redmine < issueRecords.length;redmine++){
                    const redmine_id = issueRecords[redmine].id;     
                    if(parseInt(sysaid_issueId) === redmine_id){
                        updateQueue.push({sysaid,redmine});    
                    }
                }
            }
        },

        update : async () => {  
             // `map` over the serviceRecords and return a getIssues promise for each issueId
             const promises = updateQueue.map(({sysaid, redmine}) => SchedulerService().updateTask(sysaid, redmine));          
             //// Wait for all the promises to resolve
             const data = await Promise.all(promises);          
             //// Loop over the resolved promises and log the issueId
             //data.forEach((issueId) => {
             //    issueRecords.push(issueId);
             //});
        },


        updateTask : async (sysaid, redmine) => {             
            const sr = serviceRecords[sysaid];
            const issue = issueRecords[redmine];

            var id = sr.id;

            var issue_id = issue.id;
            var custom_fields = issue.custom_fields;
            var issue_status = issue.status.id;

            var issue_pending = "";
            var issue_solution = "";

            for(let i = 0;i < custom_fields.length;i++){
                if(custom_fields[i].id === 10){
                    issue_pending = custom_fields[i].value;
                }
                if(custom_fields[i].id === 11){
                    issue_solution = custom_fields[i].value;
                }
            }

            issue_status = parseInt(issue_status);

            var status = issue_status == 1 ? 1 : (issue_status == 2 ? 3 : (issue_status == 3 ? 7 : (issue_status == 5 ? 8 : 3)));

            var requestData = JSON.parse(JSON.stringify(
                {
                    id,
                    status,
                    solution: issue_solution,
                    custom_notes: issue_pending
                }
            ));    

            var options = {
                url: `http://localhost:${_auth2.default.serverPort}/sysaid/${id}`,
                method: 'PUT',
                headers: {
                    authorization: `${_auth2.default.secret}`
                },
                json: requestData
            }      

            //console.log(issueRecords[redmine]);
            //console.log(options);

            return new Promise(function (resolve, reject) {
                _request2.default.call(void 0, options, function (error, res, body) {
                    if (!error && res.statusCode == 200) {               
                        resolve(body);
                    } else {
                        reject(error);
                    }
                });
            });   
        },

        
    }


}

exports. default = new SchedulerService();
