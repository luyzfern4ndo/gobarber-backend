import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  // Método estático sequelize
  static init(sequelize) {
    super.init(
      {
        // Pode evitar chave primária
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this; // Retorna o model inicializado
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
    // Quando uma tabela tem mais de um relacionamento com outro model
    // é obrigado a usar o "as" para dar o apelido para o relacionamento
  }
}

export default Appointment;
