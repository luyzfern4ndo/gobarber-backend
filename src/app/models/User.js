import Sequelize, { Model } from 'sequelize';

// yarn add bcryptjs
// Serve para criptografar a senha
import bcrypt from 'bcryptjs';

class User extends Model {
  // Método estático sequelize
  static init(sequelize) {
    super.init(
      {
        // Pode evitar chave primária
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL, // É um campo que não existe na base de dados
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    // Funcionalidade do Sequelize de Hooks
    // São trechos de código que são executados automaticamente
    // Nesse caso do beforeSave, antes de um usuário ser salvo ou editado no banco
    // o trecho de código do Hook será executado de forma automática
    // beforeCreate (antes de criar), beforeUpdate (antes de editar)
    this.addHook('beforeSave', async user => {
      if (user.password) {
        // Significa que está cadastrando um novo usuário informando a senha
        // ou editando a senha de um usuário
        user.password_hash = await bcrypt.hash(user.password, 8); // Nível 8 de criptografia
      }
    });

    return this; // Retorna o model inicializado
  }

  static associate(models) {
    // tipo de relacionamento (pertence à)
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
