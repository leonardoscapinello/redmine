'use strict';

import sysaidConf from '../../config/sysaid';
import request from 'request';

class Sysaid{

    constructor(){
        console.log(sysaidConf.server);
    }

    async connect(){
        
        const login = `${sysaidConf.server}${sysaidConf.api}/login`;

        await request(login, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body) // Print the google web page.
             }
        })

    }

}


export default new Sysaid()