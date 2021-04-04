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
    instance.validateRequest(requestBody, endpoint, method, contentType);
    const validateParams = paramsValidator(endpoint, method);
    const queryKeys = getKeys(req.query);
    validateParams(req.query, queryKeys, instance.validateQueryParam);
    const paramsKeys = getKeys(req.params);
    validateParams(req.params, paramsKeys, instance.validatePathParam);
    const headersKeys = getKeys(req.headers);
    validateParams(req.headers, headersKeys, instance.validateHeaderParam);

    return next();
  } catch (error) {
    if (error.message.includes('Missing header')) {
      return next();
    }
    error.status = 400;
    return next(error);
  }
};

module.exports = { init, validateMiddleware };
