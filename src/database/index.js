// Esse arquivo realizará a conexão com o banco e carregar os models
import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';

const models = [User, File]; // Array contendo as classes

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Faz conexão com a base e exporta os módulos
    this.connection = new Sequelize(databaseConfig);
    // Conexão com a base de dados
    // É a variável esperada dentro do Model, no método init

    models.map(model => {
      return model.init(this.connection);
    });
  }
}

export default new Database();
