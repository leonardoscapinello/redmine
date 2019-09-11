import SchedulerService from '../services/scheduler';

class SchedulerController {

    constructor(){        
        SchedulerService.main();
    }


}

export default new SchedulerController();