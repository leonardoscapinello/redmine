import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class SMS extends Model {
  static init(sequelize) {
    super.init(
      {
        cpf: Sequelize.STRING,
        token: Sequelize.STRING
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

export default SMS;
