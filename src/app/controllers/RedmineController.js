import RedmineApi from '../services/redmine';


class RedmineController {

    constructor(){        
        //RedmineApi.connect();
    }

    async index(req, res) {
        await RedmineApi.getIssues()
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
    }

    async show(req, res) {
        const { id_issue } = req.params;
        await RedmineApi.getIssue(id_issue)
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
    }

    async store(req, res) {
        const { id_sr } = req.params;
        await RedmineApi.createIssue(id_sr)
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
    }

}

export default new RedmineController();