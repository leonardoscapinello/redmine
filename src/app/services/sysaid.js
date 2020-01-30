import request from 'request';
import sysaidConf from '../../config/sysaid';

let session_id = null;

const SysAidApi = function init() {
  return {
    connect: async () => {
      const options = {
        uri: `${sysaidConf.server.main}${sysaidConf.server.login}`,
        method: 'POST',
        json: {
          user_name: `${sysaidConf.user_name}`,
          password: `${sysaidConf.password}`,
        },
      };
      return new Promise((resolve, reject) => {
        request(options, (error, res) => {
          if (!error && res.statusCode === 200) {
            // eslint-disable-next-line prefer-destructuring
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

    // eslint-disable-next-line consistent-return
    getSRs: async () => {
      const url = `${sysaidConf.server.main}${sysaidConf.server.sr}${sysaidConf.queryParams.fields}`;
      // console.log(`Connecting to remote server on: ${url}`);
      try {
        const options = {
          url,
          method: 'GET',
          headers: {
            Cookie: session_id,
          },
        };
        return new Promise((resolve, reject) => {
          request(options, (error, res, body) => {
            if (!error && res.statusCode === 200) {
              resolve(JSON.parse(body));
            } else {
              reject(error);
            }
          });
        });
      } catch (error) {
        console.error(error);
      }
    },

    getUniqueSR: async (id_sr = 1) => {
      const url = `${sysaidConf.server.main}${sysaidConf.server.sr}/${id_sr}${sysaidConf.queryParams.fields}`;
      // console.log(`Connecting to remote server on: ${url}`);
      const options = {
        url,
        method: 'GET',
        headers: {
          Cookie: session_id,
        },
      };
      return new Promise((resolve, reject) => {
        request(options, (error, res, body) => {
          if (!error && res.statusCode === 200) {
            resolve(JSON.parse(body));
          } else {
            reject(error);
          }
        });
      });
    },

    // eslint-disable-next-line consistent-return
    updateSR: async (id = 1, info = {}) => {
      try {
        const url = `${sysaidConf.server.main}${sysaidConf.server.sr}/${id}`;
        // console.log(`Connecting to remote server on: ${url}`);
        const { status, cust_notes, solution } = info;
        let requestData = '';

        if (cust_notes !== '' && cust_notes !== undefined) {
          requestData = JSON.parse(
            JSON.stringify({
              id,
              info: [
                { key: 'status', value: `${status}` },
                { key: 'solution', value: `${solution}` },
                {
                  key: 'notes',
                  value: [
                    {
                      userName: 'sysaid_admin',
                      createDate: Date.now(),
                      text: `${cust_notes}`,
                    },
                  ],
                },
              ],
            })
          );
        } else {
          requestData = JSON.parse(
            JSON.stringify({
              id,
              info: [
                { key: 'status', value: `${status}` },
                { key: 'solution', value: `${solution}` },
              ],
            })
          );
        }
        const options = JSON.parse(
          JSON.stringify({
            url,
            method: 'PUT',
            headers: {
              Cookie: session_id,
            },
            json: requestData,
          })
        );
        return new Promise((resolve, reject) => {
          request(options, (error, res, body) => {
            if (!error && res.statusCode === 200) {
              resolve(body);
            } else {
              reject(error);
            }
          });
        });
      } catch (err) {
        console.log(err);
      }
    },

    LinkSysAid: async (id, id_issue) => {
      const url = `${sysaidConf.server.main}${sysaidConf.server.sr}/${id}`;
      console.log(
        `└─ Service request #${id} has been linked to Redmine issue #${id_issue}`
      );
      const requestData = JSON.parse(
        JSON.stringify({
          id,
          info: [{ key: `${sysaidConf.fields.issueId}`, value: `${id_issue}` }],
        })
      );
      const options = JSON.parse(
        JSON.stringify({
          url,
          method: 'PUT',
          headers: {
            Cookie: session_id,
          },
          json: requestData,
        })
      );
      return new Promise((resolve, reject) => {
        request(options, (error, res, body) => {
          if (!error && res.statusCode === 200) {
            resolve(body);
          } else {
            console.log(body);
            reject(error);
          }
        });
      });
    },

    // eslint-disable-next-line consistent-return
    getUser: async id_user => {
      const url = `${sysaidConf.server.main}${sysaidConf.server.user}/${id_user}`;
      // console.log(url);
      try {
        const options = {
          url,
          method: 'GET',
          headers: {
            Cookie: session_id,
          },
        };
        return new Promise((resolve, reject) => {
          request(options, (error, res, body) => {
            if (!error && res.statusCode === 200) {
              resolve(JSON.parse(body));
            } else {
              reject(error);
            }
          });
        });
      } catch (error) {
        console.error(error);
      }
    },
  };
};

export default new SysAidApi();
