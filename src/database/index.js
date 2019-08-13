// Esse arquivo realizará a conexão com o banco e carregar os models
import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';

import User from '../app/models/User';
import File from '../app/models/File';
import Appointment from '../app/models/Appointment';

const models = [User, File, Appointment]; // Array contendo as classes

class Database {
  constructor() {
    this.init();
    this.mongo();
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

  mongo() {
    // Criando imagem do mongo no docker
    // docker run --name mongobarber -p 27017:27017 -d -t mongo

    this.mongoConnection = mongoose.connect(
      'mongodb://localhost:27017/gobarber',
      { useNewUrlParser: true, useFindAndModify: true }
    );
  }
}

export default new Database();
