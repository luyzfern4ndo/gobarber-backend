import express from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();

    this.middlewares();

    this.routes();
  }

  middlewares() {
    this.server.use(express.json()); // Aplicação recebe requisição através de json

    // Express static: serve arquivos estáticos como imagens, css, html, etc.
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes); // As rotas também são middlewares
  }
}

// module.exports = new App().server;
export default new App().server;
