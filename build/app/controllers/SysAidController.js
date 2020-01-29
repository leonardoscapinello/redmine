"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sysaid = require('../services/sysaid'); var _sysaid2 = _interopRequireDefault(_sysaid);


class SysAidController {

    constructor(){        
        _sysaid2.default.connect();
    }

    async index(req, res) {
        await _sysaid2.default.getSRs()
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
    }

    async show(req, res) {
        const { id } = req.params;
        await _sysaid2.default.getUniqueSR(id)
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

        
        await _sysaid2.default.updateSR(id, json)
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
    }

}

exports. default = new SysAidController();