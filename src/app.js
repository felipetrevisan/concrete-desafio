require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

class App {
  constructor() {
    this.express = express();
    this.mongoose = mongoose;

    this.middlewares();
    this.database();
    this.routes();
    this.errorHandler();
  }

  middlewares() {
    this.express.use(express.json());
    this.express.use(cors());
  }

  database() {
    this.mongoose.connect(
      'mongodb+srv://concrete-desafio:6yEgf8UAft2EN3S@cluster0-uact6.mongodb.net/concrete?retryWrites=true&w=majority',
      { useNewUrlParser: true },
    );
  }

  routes() {
    this.express.use(require('./routes'));
  }

  errorHandler() {
    this.express.use(require('./middlewares/errorHandler'));
  }
}

module.exports = new App().express;
