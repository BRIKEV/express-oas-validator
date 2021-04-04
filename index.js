

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

/**
 * Validate method
 * @param {object} openApiDef OpenAPI definition
 * @param {object} options Options to extend the errorHandler or Ajv configuration
 * @returns {ValidatorMethods} validator methods
 */
const validate = (openApiDef, options = {}) => {
  

  return {
    validateMiddleware,
    validateRequest
    validateQueryParam,
    validatePathParam,
    validateHeaderParam,
    validateResponse,
  };
}
