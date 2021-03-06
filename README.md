![npm](https://img.shields.io/npm/v/express-oas-validator)
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

```bash
npm install --save express-oas-validator
```

## Usage

This is a basic usage of this package.

```js
const express = require('express');
// We recommed to install "body-parser" to validate request body
const bodyParser = require('body-parser');
const { init } = require('express-oas-validator');
const swaggerDefinition = require('./swaggerDefinition.json');

const app = express();

// Each instance of the validator will provide two methods to perform validation
const { validateRequest, validateResponse } = init(swaggerDefinition);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware validator
app.post('/api/v1/songs', validateRequest(), (req, res) => res.send('You save a song!'));

// Middleware validator with custom configuration
app.get('/api/v1/albums/:id', validateRequest({ headers: false }), (req, res) => (
  res.json([{
    title: 'abum 1',
  }])
));

// Middleware validator with custom configuration
app.get('/api/v1/authors', validateRequest({ body: false, query: false }), (req, res) => (
  res.json([{
    title: 'abum 1',
  }])
));

// Response validator
app.post('/api/v1/name', (req, res, next) => {
  try {
    validateResponse('Error string', req, 200);
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

## Methods

### _init(openApiDef, options)_

This method generates a new instance of the validator, which will provide us with the `validateRequest` and `validateResponse` methods that we can use to validate the input and output of our endpoints.

It's possible to generate multiple instances using different API definitions and / or configuration.

**Parameters**

| Name        | Type   | Description        |
| ------------| ------ | ------------------ |
| openApiDef  | `object` | OpenAPI definition |
| options     | `object` | Options to extend the errorHandler or Ajv configuration |

**Example**

```js
const swaggerDefinition = require('./swaggerDefinition.json');

// Each instance of the validator will provide two methods to perform validation
const { validateRequest, validateResponse } = init(swaggerDefinition);
```

### _validateRequest(config)_

Express middleware that validates the input of the endpoint based on its definition. This includes the request body, headers, path params and query params.

Optionally, the method can receive a parameter with a configuration object to override the defaults and determine which of these inputs we want the middleware to validate.

**Parameters**

| Name        | Type   | Description        |
| ------------| ------ | ------------------ |
| config  | `object` | Options to override the default configuration |

**Configuration options**

| Name        | Type   | Description        | Default value |
| ------------| ------ | ------------------ | ------------- |
| body | `boolean` | Indicates if request body will be validated | `true` |
| params | `boolean` | Indicates if path params will be validated | `true` |
| headers | `boolean` | Indicates if request headers will be validated | `true` |
| query | `boolean` | Indicates if query params will be validated | `true` |
| required | `boolean` | Indicates if required fields will be validated | `true` |
| errorStatusCode | `number` | HTTP code that will be returned in case the input validation fails | `400` |

**Example**

```js
// Use middleware with default settings
app.get('/api/v1/albums/:id', validateRequest(), (req, res) => (
  res.json([{
    title: 'abum 1',
  }])
));

// Use middleware with custom settings
app.get('/api/v1/albums/:id', validateRequest({ headers: false }), (req, res) => (
  res.json([{
    title: 'abum 1',
  }])
));
```

### _validateResponse(payload, req, status)_

Method to validate response payload based on the docs and the status we want to validate.

**Parameters**

| Name        | Type   | Description        |
| ------------| ------ | ------------------ |
| payload     | `*`      | Response we want to validate |
| req         | `object` | Options to extend the errorHandler or Ajv configuration |
| status      | `number` | Response status we want to validate |

**Example**

```js
validateResponse('Error string', req, 200);
```

## Example with `express-jsdoc-swagger`

This is an example that uses this library together with [express-jsdoc-swagger](https://www.npmjs.com/package/express-jsdoc-swagger).

```js
const express = require('express');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const { init } = require('express-oas-validator');

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
    const { validateRequest, validateResponse } = init(data);

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
    app.post('/api/v1/songs', validateRequest(), (req, res) => res.send('You save a song!'));

    /**
     * POST /api/v1/name
     * @param {string} request.body.required - name body description
     * @return {object} 200 - song response
     */
    app.post('/api/v1/name', (req, res, next) => {
      try {
        validateResponse('Error string', req);
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
    app.get('/api/v1/authors', validateRequest({ headers: false }), (req, res) => (
      res.json([{
        title: 'abum 1',
      }])
    ));

    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
      res.status(err.status).json(err);
    });

    resolve(app);
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
});

module.exports = serverApp;
```
