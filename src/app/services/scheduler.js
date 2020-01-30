import request from 'request';
import schedule from 'node-schedule';
import dateformat from 'dateformat';

import schedulerConf from '../../config/scheduler';
import authConf from '../../config/auth';
import sysaidConf from '../../config/sysaid';

let interations = 0;
let serviceRecords = [];
let issueRecords = [];

let updateQueue = [];

const SchedulerService = function init() {
  const execute = async () => {
    await SchedulerService().getSR();
    await SchedulerService().issuesPush();
    await SchedulerService().organizeListIndex();
    await SchedulerService().update();
  };

  return {
    main: async () => {
      console.log(
        `*  Starting Scheduler on ${dateformat(
          new Date(),
          'dd/mm/yyyy HH:MM:ss'
        )}`
      );
      console.log(
        `└─ Scheduler timer is set to ${schedulerConf.timer.minutes} minute(s)`
      );
      schedule.scheduleJob(`*/${schedulerConf.timer.minutes} * * * *`, () => {
        console.time('└─ Scheduler execution time');
        if (interations === 0) {
          console.log(`└─ Setting scheduler runtime to full time.`);
        } else {
          console.log(`------------------------`);
        }
        interations++;
        console.log(`└─ Job execution number: ${interations}.`);
        execute()
          .then(() => {
            console.log(`└─ Job ${interations} was successfully executed.`);
            console.log(
              `└─ Execution date ${dateformat(
                new Date(),
                'dd/mm/yyyy HH:MM:ss'
              )}`
            );
            console.timeEnd('└─ Scheduler execution time');
          })
          .catch(error => {
            console.log(
              `└─ Job ${interations} returned error while executing.`
            );
            console.log(`└─ Error:`);
            console.error(error);
          });
      });
    },

    getSR: async () => {
      serviceRecords = [];
      const options = {
        url: `http://localhost:${authConf.serverPort}/sysaid`,
        method: 'GET',
        headers: {
          authorization: `${authConf.secret}`,
        },
      };
      return new Promise((resolve, reject) => {
        request(options, (error, res, body) => {
          if (!error && res.statusCode === 200) {
            const srs = JSON.parse(body);
            const { response } = srs;
            for (let i = 0; i < response.length; i++) {
              const { id, info } = response[i];

              console.log(`└─── ------------------------------------`);
              console.log(`└─── Getting SR #${id} and working on it.`);

              let status = '';
              let issueId = '';
              let statusClass = '';
              for (let x = 0; x < info.length; x++) {
                if (info[x].key === 'status') {
                  status = info[x].value;
                  statusClass = info[x].valueClass;
                }
                if (info[x].key === sysaidConf.fields.issueId) {
                  issueId = info[x].value;
                }
              }
              if (statusClass === 0) {
                if (issueId !== null && issueId !== '') {
                  console.log(
                    `└─── This SR was classified as an integration item, promoting it to the update list.`
                  );
                  serviceRecords.push({ id, status, issueId });
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

    getIssues: async issueId => {
      return new Promise((resolve, reject) => {
        const options = {
          url: `http://localhost:${authConf.serverPort}/redmine/${issueId}`,
          method: 'GET',
          headers: {
            authorization: `${authConf.secret}`,
          },
        };
        request(options, (error, res, body) => {
          if (!error && res.statusCode === 200) {
            const issues = JSON.parse(body);
            const { issue } = issues.response;
            const { id, status, custom_fields } = issue;
            resolve({ id, status, custom_fields });
          } else {
            reject(error);
          }
        });
      });
    },

    issuesPush: async () => {
      issueRecords = [];
      // `map` over the serviceRecords and return a getIssues promise for each issueId
      const promises = serviceRecords.map(({ issueId }) =>
        SchedulerService().getIssues(issueId)
      );
      // Wait for all the promises to resolve
      const data = await Promise.all(promises);
      // Loop over the resolved promises and log the issueId
      data.forEach(issueId => {
        issueRecords.push(issueId);
      });
    },

    organizeListIndex: async () => {
      updateQueue = [];
      for (let sysaid = 0; sysaid < serviceRecords.length; sysaid++) {
        const sysaid_issueId = serviceRecords[sysaid].issueId;
        for (let redmine = 0; redmine < issueRecords.length; redmine++) {
          const redmine_id = issueRecords[redmine].id;
          if (parseInt(sysaid_issueId, 0) === redmine_id) {
            console.log(
              `└─── Organizing the registration in Redmine with its respective in SysAid`
            );
            updateQueue.push({ sysaid, redmine });
          }
        }
      }
    },

    update: async () => {
      // `map` over the serviceRecords and return a getIssues promise for each issueId
      const promises = updateQueue.map(({ sysaid, redmine }) =>
        SchedulerService().updateTask(sysaid, redmine)
      );
      // // Wait for all the promises to resolve
      const data = await Promise.all(promises);
      // // Loop over the resolved promises and log the issueId
      data.forEach(issueId => {
        issueRecords.push(issueId);
      });
    },

    updateTask: async (sysaid, redmine) => {
      const sr = serviceRecords[sysaid];
      const issue = issueRecords[redmine];

      const { id } = sr;

      const issue_id = issue.id;
      const { custom_fields } = issue;
      let issue_status = issue.status.id;

      let issue_pending = '';
      let issue_solution = '';

      for (let i = 0; i < custom_fields.length; i++) {
        if (custom_fields[i].id === 10) {
          issue_pending = custom_fields[i].value;
        }
        if (custom_fields[i].id === 11) {
          issue_solution = custom_fields[i].value;
        }
      }

      issue_status = parseInt(issue_status, 0);

      let status = 3;
      if (issue_status === 1) status = 1;
      if (issue_status === 2) status = 3;
      if (issue_status === 3) status = 7;
      if (issue_status === 5) status = 8;

      const requestData = JSON.parse(
        JSON.stringify({
          id,
          status,
          solution: issue_solution,
          custom_notes: issue_pending,
        })
      );

      const options = {
        url: `http://localhost:${authConf.serverPort}/sysaid/${id}`,
        method: 'PUT',
        headers: {
          authorization: `${authConf.secret}`,
        },
        json: requestData,
      };

      // console.log(issueRecords[redmine]);
      // console.log(options);

      return new Promise((resolve, reject) => {
        request(options, (error, res, body) => {
          if (!error && res.statusCode === 200) {
            console.log(
              `└─── Updating SR #${id} data based on it's redmine ticket #${issue_id}`
            );
            resolve(body);
          } else {
            reject(error);
          }
        });
      });
    },
  };
};

export default new SchedulerService();
