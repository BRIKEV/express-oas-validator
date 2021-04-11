const openapiValidatorUtils = require('openapi-validator-utils');
const {
  getKeys,
  paramsValidator,
  getParameters,
  paramsArray,
  handleError,
} = require('./utils');
const getConfig = require('./utils/config');

let instance = null;

/**
 * Validator methods
 * @typedef {object} Options
 * @property {function()} errorHandler custom error handler
 * @property {object} ajvConfig Ajv config object
 */

/**
 * Init method to instantiate the OpenAPI validator
 * @param {object} openApiDef OpenAPI definition
 * @param {Options} options Options to extend the errorHandler or Ajv configuration
 */
const init = (openApiDef, options = {}) => {
  if (instance === null) {
    instance = openapiValidatorUtils(openApiDef, options);
  }
  return instance;
};

/**
 * Validator methods
 * @typedef {object} EndpointConfig
 * @property {boolean} body custom error handler
 * @property {boolean} params Ajv config object
 * @property {boolean} headers Ajv config object
 * @property {boolean} query Ajv config object
 * @property {boolean} required Ajv config object
 */

/**
 * Endpoint configuration
 * @param {EndpointConfig} endpointConfig middleware validator options
 */
const validateMiddleware = endpointConfig => (req, res, next) => {
  const config = getConfig(endpointConfig);
  try {
    const {
      contentType, method, endpoint, requestBody,
    } = getParameters(req);
    const validateParams = paramsValidator(endpoint, method);
    if (config.required) {
      const paramsToValidate = paramsArray(req);
      instance.validateRequiredValues(paramsToValidate, endpoint, method);
    }
    if (config.query) {
      const queryKeys = getKeys(req.query);
      validateParams(req.query, queryKeys, instance.validateQueryParam);
    }
    if (instance.isRequestRequired(endpoint, method, contentType) && config.body) {
      instance.validateRequest(requestBody, endpoint, method, contentType);
    }
    if (config.headers) {
      const headersKeys = getKeys(req.headers);
      validateParams(req.headers, headersKeys, instance.validateHeaderParam);
    }
    return next();
  } catch (error) {
    return handleError(error, config.errorStatusCode, next);
  }
};

/**
 * Method to validate response payload
 * @param {*} payload response we want to validate
 * @param {object} req express request object
 * @param {number} status response status we want to validate
 */
const responseValidation = (payload, req, status = 200) => {
  try {
    const {
      contentType,
      method,
      endpoint,
    } = getParameters(req);
    return instance.validateResponse(payload, endpoint, method, status, contentType);
  } catch (error) {
    error.status = 500;
    error.statusCode = 500;
    throw error;
  }
};

module.exports = { init, validateMiddleware, responseValidation };
