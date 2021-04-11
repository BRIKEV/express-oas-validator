const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const { init, validateMiddleware, responseValidation } = require('..');

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

  // Add middleware to parse request body
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

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
   * PATCH /api/v1/songs
   * @return {object} 200 - song response
   */
  app.patch('/api/v1/songs', validateMiddleware(), (req, res) => res.send('You save a song!'));

  /**
   * POST /api/v1/albums
   * @param {array<Song>} request.body.required
   * @return {object} 200 - song response
   */
  app.post('/api/v1/albums', validateMiddleware({
    body: false,
    params: false,
    headers: false,
    query: false,
    required: false,
  }), (req, res) => res.send('Hello World!'));

  /**
   * POST /api/v1/name
   * @param {string} request.body.required - name body description
   * @return {object} 200 - song response
   */
  app.post('/api/v1/name', (req, res, next) => {
    try {
      responseValidation('Error string', req);
      return res.send('Hello World!');
    } catch (error) {
      return next(error);
    }
  });

  /**
   * POST /api/v2/name
   * @param {string} request.body.required - name body description
   * @return {Song} 200 - song response
   */
  app.post('/api/v2/name', (req, res, next) => {
    try {
      responseValidation('Error string', req, 200);
      return res.send('Hello World!');
    } catch (error) {
      return next(error);
    }
  });

  /**
   * GET /api/v1/albums/{id}
   * @summary This is the summary or description of the endpoint
   * @param {string} id.path.required
   * @return {object} 200 - success response - application/json
   */
  app.get('/api/v1/albums/:id', validateMiddleware(), (req, res) => (
    res.json([{
      title: 'abum 1',
    }])
  ));

  /**
   * GET /api/v1/authors
   * @summary This is the summary or description of the endpoint
   * @param {string} name.query.required - name param description - enum:type1,type2
   * @param {array<string>} license.query - name param description
   * @return {object} 200 - success response - application/json
   */
  app.get('/api/v1/authors', validateMiddleware(), (req, res) => (
    res.json([{
      title: 'abum 1',
    }])
  ));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    res.status(err.status).json(err);
  });
});

module.exports = serverApp;
