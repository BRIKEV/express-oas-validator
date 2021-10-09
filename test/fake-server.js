const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const { init } = require('..');

const addBaseRoutes = require('./internalRoutes/routes');
const buildBirdRoutes = require('./internalRoutes/birds');

const options = {
  info: {
    version: '1.0.0',
    title: 'Albums store',
    license: {
      name: 'MIT',
    },
  },
  filesPattern: ['./fake-server.js', './internalRoutes/*.js'],
  baseDir: __dirname,
};

const app = express();
const instance = expressJSDocSwagger(app)(options);

const serverApp = () => new Promise(resolve => {
  instance.on('finish', data => {
    const validatorInstance = init(data);

    addBaseRoutes(app, validatorInstance);
    app.use('/api/birds', buildBirdRoutes(validatorInstance));
    resolve(app);
  });

  // Add middleware to parse request body
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status).json(err);
  });
});

module.exports = serverApp;
