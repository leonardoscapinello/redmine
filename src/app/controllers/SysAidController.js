import sysaid from '../services/sysaid';

class SysAidController {

    async index(req, res) {
       
        await sysaid.connect().then(req, res => {
            console.log(req.body);
            res.status(200).json({ok:true});
        });
        
    }

}

export default new SysAidController();