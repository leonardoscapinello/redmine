import SysAidApi from '../services/sysaid';


class SysAidUserController{

    async show(req, res) {
        const { id } = req.params;
        await SysAidApi.getUser(id)
        .then(response => {
            return res.status(200).json({response});
        }).catch(error => {
            return res.status(400).json({error});
        });
    }


}

export default new SysAidUserController();