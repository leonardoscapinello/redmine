import SchedulerService from '../services/scheduler';

class SchedulerController {

    constructor(){        
        SchedulerService.initialize();
    }


}

export default new SchedulerController();