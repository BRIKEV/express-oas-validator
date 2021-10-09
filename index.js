const openApiValidatorUtils = require('openapi-validator-utils');
const {
  getKeys,
  paramsValidator,
  getParameters,
  paramsArray,
  handleError,
  filterUndefinedProps,
} = require('./utils');
const { getFiles } = require('./utils/files');
const getConfig = require('./utils/config');

const FILES_CONTENT_TYPE = 'multipart/form-data';

/**
 * Validator settings
 * @typedef {object} ValidatorOptions
 * @property {function} errorHandler - Custom error handler
 * @property {object} ajvConfig - Ajv config object
 */

/**
 * Request validation configuration object
 * @typedef {object} RequestValidationConfig
 * @property {boolean} [body] - Indicates if request body will be validated
 * @property {boolean} [params] - Indicates if path params will be validated
 * @property {boolean} [headers] - Indicates if request headers will be validated
 * @property {boolean} [query] - Indicates if query params will be validated
 * @property {boolean} [required] - Indicates if required fields will be validated
 */

/**
 * Validate data on the request complies with the schema specified in the open
 * API definition object. By default, this validates path params, query params,
 * headers and request body.
 *
 * @param {RequestValidationConfig} [endpointConfig] - Middleware validator
 *  options, which will allow configuring which elements will be validated
 */
const validateRequest = instance => endpointConfig => async (req, res, next) => {
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
    if (config.params) {
      const paramKeys = getKeys(req.params);
      validateParams(req.params, paramKeys, instance.validatePathParam);
    }
    if (config.query) {
      const queryKeys = getKeys(req.query);
      validateParams(req.query, queryKeys, instance.validateQueryParam);
    }
    if (instance.isRequestRequired(endpoint, method, contentType) && config.body) {
      let payload = requestBody;
      if (contentType === FILES_CONTENT_TYPE) {
        payload = await getFiles(req);
      }
      instance.validateRequest(payload, endpoint, method, contentType);
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
 * @param {*} payload - Response we want to validate
 * @param {object} req - Express request object
 * @param {number} [status] - Response status we want to validate
 */
const validateResponse = instance => (payload, req, status = 200) => {
  try {
    const {
      contentType,
      method,
      endpoint,
    } = getParameters(req);

    // Payload properties explicitly set to undefined will be excluded from validation
    const cleanPayload = (typeof payload === 'object' && payload !== null)
      ? filterUndefinedProps(payload) : payload;
    return instance.validateResponse(cleanPayload, endpoint, method, status, contentType);
  } catch (error) {
    error.status = 500;
    error.statusCode = 500;
    throw error;
  }
};

/**
 * @typedef {object} ValidatorInstance
 * @property {function} validateRequest.required - Method to validate the request
 * @property {function} validateResponse.required - Method to validate the response
 */

/**
 * Init method to instantiate the OpenAPI validator
 * @param {object} validateRequest - OpenAPI definition
 * @param {ValidatorOptions} [options] - Options to extend the errorHandler or
 *  Ajv configuration
 * @returns {ValidatorInstance} - Methods to validate the endpoints
 */
 const init = (openApiDef, options = {}) => {
  const validatorInstance = openApiValidatorUtils(openApiDef, options);

  return {
    validateRequest: validateRequest(validatorInstance),
    validateResponse: validateResponse(validatorInstance),
  };
};

module.exports = { init };
