"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sysaid = require('../services/sysaid'); var _sysaid2 = _interopRequireDefault(_sysaid);


class SysAidUserController{

    async show(req, res) {
        const { id } = req.params;
        await _sysaid2.default.getUser(id)
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
    }


}

exports. default = new SysAidUserController();