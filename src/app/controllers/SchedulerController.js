import SchedulerService from '../services/scheduler';

class SchedulerController {

    constructor(){        
        SchedulerService.initialize();
        SchedulerService.execute();
    }


}

export default new SchedulerController();