"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

var _Users = require('../app/models/Users'); var _Users2 = _interopRequireDefault(_Users);

const models = [_Users2.default];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new (0, _sequelize2.default)(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

exports. default = new Database();
