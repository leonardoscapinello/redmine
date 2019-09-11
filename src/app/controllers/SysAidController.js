import SysAidApi from '../services/sysaid';


class SysAidController {

    constructor(){        
        SysAidApi.connect();
    }

    async index(req, res) {
        await SysAidApi.getSRs()
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
    }

    async show(req, res) {
        const { id } = req.params;
        await SysAidApi.getUniqueSR(id)
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
    }

    async update(req, res) {
        const { id } = req.params;
        const json = req.body;
        //const { status, cust_notes, solution } = json;

        
        await SysAidApi.updateSR(id, json)
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
    }

}

export default new SysAidController();