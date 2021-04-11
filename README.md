[![Build](https://github.com/BRIKEV/express-oas-validator/actions/workflows/runTests.yml/badge.svg)](https://github.com/BRIKEV/express-oas-validator/actions/workflows/runTests.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/BRIKEV/express-oas-validator/badge.svg)](https://snyk.io/test/github/BRIKEV/express-oas-validator)
[![Maintainability](https://api.codeclimate.com/v1/badges/13aa6d75c21855b8857c/maintainability)](https://codeclimate.com/github/BRIKEV/express-oas-validator/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/13aa6d75c21855b8857c/test_coverage)](https://codeclimate.com/github/BRIKEV/express-oas-validator/test_coverage)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

# express-oas-validator

Express OpenAPI Specification (OAS) middleware validator and response validator.

This package will expose an express middleware that will validate your endpoint based on your OpenAPI docs, and a response validator to do the same with your responses payload.

## Installation
Install using the node package registry:

```
npm install --save express-oas-validator
```

## Usage

This is a basic usage of this package.

```js
const express = require('express');
// We recommed to install "body-parser" to validate request body
const bodyParser = require('body-parser');
const { init, validateMiddleware, responseValidation } = require('express-oas-validator');
const swaggerDefinition = require('./swaggerDefinition.json');

const app = express();

init(swaggerDefinition);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware validator
app.post('/api/v1/songs', validateMiddleware(), (req, res) => res.send('You save a song!'));

// Middleware validator with custom configuration
app.get('/api/v1/albums/:id', validateMiddleware({ headers: false }), (req, res) => (
  res.json([{
    title: 'abum 1',
  }])
));

// Middleware validator with custom configuration
app.get('/api/v1/authors', validateMiddleware({ body: false, query: false }), (req, res) => (
  res.json([{
    title: 'abum 1',
  }])
));

// Response validator
app.post('/api/v1/name', (req, res, next) => {
  try {
    responseValidation('Error string', req, 200);
    return res.send('Hello World!');
  } catch (error) {
    return next(error);
  }
});

// Express default error handler
app.use((err, req, res, next) => {
  res.status(err.status).json(err);
});
```

## methods

### init(openApiDef, options)

This methods initiates the validator so that `validateMiddleware` and `responseValidation` can be used in different files.

**Parameters**

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| openApiDef  | object | OpenAPI definition |
| options     | object | Options to extend the errorHandler or Ajv configuration |

```js
const swaggerDefinition = require('./swaggerDefinition.json');

init(swaggerDefinition);
```


## validateMiddleware(endpointConfig)


Express middleware that receives this configuration options and validates each of the options.

```js
const DEFAULT_CONFIG = {
  body: true,
  params: true,
  headers: true,
  query: true,
  required: true,
};
```

**Example**

```js
// This one uses the DEFAULT_CONFIG
app.get('/api/v1/albums/:id', validateMiddleware(), (req, res) => (
  res.json([{
    title: 'abum 1',
  }])
));

// With custom configuration
app.get('/api/v1/albums/:id', validateMiddleware({ headers: false }), (req, res) => (
  res.json([{
    title: 'abum 1',
  }])
));
```

## responseValidation(payload, req, status)

Method to validate response payload based on the docs and the status we want to validate.

**Parameters**

| Name        | Type   | Description        |
| ------------|:------:| ------------------:|
| payload     | *      | response we want to validate |
| req         | object | Options to extend the errorHandler or Ajv configuration |
| status      | number | esponse status we want to validate |


**Example**

```js
responseValidation('Error string', req, 200);
```

## Example with express-jsdoc-swagger

This is an example using [express-jsdoc-swagger](https://www.npmjs.com/package/express-jsdoc-swagger).

```js
const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const { init, validateMiddleware, responseValidation } = require('express-oas-validator');

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
   * GET /api/v1/authors
   * @summary This is the summary or description of the endpoint
   * @param {string} name.query.required - name param description - enum:type1,type2
   * @param {array<string>} license.query - name param description
   * @return {object} 200 - success response - application/json
   */
  app.get('/api/v1/authors', validateMiddleware({ headers: false }), (req, res) => (
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
```