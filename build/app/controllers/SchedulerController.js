"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _scheduler = require('../services/scheduler'); var _scheduler2 = _interopRequireDefault(_scheduler);

class SchedulerController {

    constructor(){        
        _scheduler2.default.main();
    }


}

exports. default = new SchedulerController();