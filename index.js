const openapiValidatorUtils = require('openapi-validator-utils');
const {
  getKeys,
  paramsValidator,
  getParameters,
} = require('./utils');

let instance = null;

const init = (openApiDef, options = {}) => {
  if (instance === null) {
    instance = openapiValidatorUtils(openApiDef, options);
  }
  return instance;
};

const validateMiddleware = () => (req, res, next) => {
  try {
    const {
      contentType,
      method,
      endpoint,
      requestBody,
    } = getParameters(req);

    // TODO: add required validator

    const validateParams = paramsValidator(endpoint, method);

    const paramsKeys = getKeys(req.params);
    validateParams(req.params, paramsKeys, instance.validatePathParam);

    const queryKeys = getKeys(req.query);
    validateParams(req.query, queryKeys, instance.validateQueryParam);

    if (Object.keys(requestBody).length > 0) {
      instance.validateRequest(requestBody, endpoint, method, contentType);
    }

    const headersKeys = getKeys(req.headers);
    validateParams(req.headers, headersKeys, instance.validateHeaderParam);

    return next();
  } catch (error) {
    error.status = 400;
    if (error.message.includes('Missing header')) {
      return next();
    }
    return next(error);
  }
};

const responseValidation = (payload, status, req) => {
  try {
    const {
      contentType,
      method,
      endpoint,
    } = getParameters(req);
    return instance.validateResponse(payload, endpoint, method, status, contentType);
  } catch (error) {
    error.status = 500;
    throw error;
  }
};

module.exports = { init, validateMiddleware, responseValidation };
