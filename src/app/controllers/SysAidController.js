import SysAidApi from '../services/sysaid';


class SysAidController {

    constructor(){        
        SysAidApi.connect();
    }

    async index(req, res) {      

        const { id } = req.params;

        await SysAidApi.getSRs(id)
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
       


    }

}

export default new SysAidController();