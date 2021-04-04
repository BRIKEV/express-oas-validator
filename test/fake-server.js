const express = require('express');
const bodyParser = require('body-parser');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const { init, validateMiddleware } = require('..');

const options = {
  info: {
    version: '1.0.0',
    title: 'Albums store',
    license: {
      name: 'MIT',
    },
  },
  filesPattern: './fake-server.js',
  baseDir: __dirname,
};

const app = express();
const instance = expressJSDocSwagger(app)(options);

const serverApp = () => new Promise(resolve => {
  instance.on('finish', data => {
    init(data);
    resolve(app);
  });
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  /**
   * A song
   * @typedef {object} Song
   * @property {string} title.required - The title
   * @property {string} artist - The artist
   * @property {integer} year - The year
   */

  /**
   * POST /api/v1/songs
   * @param {Song} request.body.required - song info
   * @return {object} 200 - song response
   */
  app.post('/api/v1/songs', validateMiddleware(), (req, res) => res.send('You save a song!'));

  /**
   * POST /api/v1/albums
   * @param {array<Song>} request.body.required
   * @return {object} 200 - song response
   */
  app.post('/api/v1/albums', (req, res) => res.send('Hello World!'));

  /**
   * POST /api/v1/name
   * @param {string} request.body.required - name body description
   * @return {object} 200 - song response
   */
  app.post('/api/v1/name', (req, res) => res.send('Hello World!'));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status).json(err);
  });
});

module.exports = serverApp;
