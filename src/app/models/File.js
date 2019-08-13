import Sequelize, { Model } from 'sequelize';

class File extends Model {
  // Método estático sequelize
  static init(sequelize) {
    super.init(
      {
        // Pode evitar chave primária
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this; // Retorna o model inicializado
  }
}

export default File;
