"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

class SMS extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        cpf: _sequelize2.default.STRING,
        token: _sequelize2.default.STRING
      },
      {
        sequelize,
      }
    );

    /*this.addHook('beforeSave', async user => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });*/
    return this;
  }

}

exports. default = SMS;
