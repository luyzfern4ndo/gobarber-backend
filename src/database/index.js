// Esse arquivo realizará a conexão com o banco e carregar os models
import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

const models = [User, File, Appointment]; // Array contendo as classes

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Faz conexão com a base e exporta os módulos
    this.connection = new Sequelize(databaseConfig);
    // Conexão com a base de dados
    // É a variável esperada dentro do Model, no método init

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
    // Método só é chamado se o associate existir. Por isso a condicional &&
  }
}

export default new Database();
