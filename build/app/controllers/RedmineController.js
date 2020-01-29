"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _redmine = require('../services/redmine'); var _redmine2 = _interopRequireDefault(_redmine);


class RedmineController {

    constructor(){        
        //RedmineApi.connect();
    }

    async index(req, res) {
        await _redmine2.default.getIssues()
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
    }

    async show(req, res) {
        const { id_issue } = req.params;
        await _redmine2.default.getIssue(id_issue)
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
    }

    async store(req, res) {
        const { id_sr } = req.params;
        await _redmine2.default.createIssue(id_sr)
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
    }

}

exports. default = new RedmineController();