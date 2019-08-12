module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Não repetir e-mail
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provider: {
        // provider é para saber se é prestador ou cliente
        type: Sequelize.BOOLEAN,
        defaultValue: false, // Valor padrão como falso (Todo usuário será um cliente)
        allowNull: false,
      },
      created_at: {
        // Registra criação de registros
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        // Registra criação de registros
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};
