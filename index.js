const openapiValidatorUtils = require('openapi-validator-utils');

/**
 * @name ValidateRequest
 * @function
 * @param {object} definition OpenApi definition
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} contentType Content api of the request we want to validate
 */

/**
 * @name ValidateParams
 * @function
 * @param {object} definition OpenApi definition
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} contentType Content api of the request we want to validate
 */

/**
 * @name ValidateResponse
 * @function
 * @param {object} definition OpenApi definition
 * @param {string} endpoint OpenApi endpoint we want to validate
 * @param {string} method OpenApi method we want to validate
 * @param {string} status OpenApi status we want to validate
 * @param {string} contentType Content api of the request we want to validate
 */

/**
 * Validator methods
 * @typedef {object} ValidatorMethods
 * @property {ValidateRequest} validateRequest
 * @property {ValidateParams} validateQueryParam
 * @property {ValidateParams} validatePathParam
 * @property {ValidateParams} validateHeaderParam
 * @property {ValidateResponse} validateResponse
 */

let instance;

/**
 * Validate method
 * @param {object} openApiDef OpenAPI definition
 * @param {object} options Options to extend the errorHandler or Ajv configuration
 * @returns {ValidatorMethods} validator methods
 */
const validate = (openApiDef, options = {}) => {
  let specDefinition = openApiDef;
  instance = openApiDef;
  if (!options.multiple && instance) {
    specDefinition = instance;
  }
  const ValidatorUtils = openapiValidatorUtils(specDefinition, options);

  const validateMiddleware = (req, res, next) => (validationOptions) => {
    // TODO: get path, body, headers and query

    // TODO: format endpoints with path params

    // TODO: Use 4 validators based on the options
  };

  return {
    validateMiddleware,
    validateRequest: ValidatorUtils.validateRequest,
    validateQueryParam: ValidatorUtils.validateQueryParam,
    validatePathParam: ValidatorUtils.validatePathParam,
    validateHeaderParam: ValidatorUtils.validateHeaderParam,
    validateResponse: ValidatorUtils.validateResponse,
  };
};

module.exports = validate;
