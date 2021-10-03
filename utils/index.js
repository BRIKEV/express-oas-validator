/** @module Utils */

/**
 * This method get keys of a param object and filter them with exceptions
 * @param {object} paramObject
 * @param {string[]} exceptions
 * @return {string[]}
 */
const getKeys = (paramObject, exceptions = []) => (
  Object.keys(paramObject)
    .filter(key => !exceptions.includes(key))
);

/**
 *  This method runs a validator function over a collection of parameters,
 * defined as an object. That function will validate the received values
 * against the schema defined for the specified endpoint.
 *
 * @param {string} endpoint - Route of the endpoint to which the param belongs
 * @param {string} method - HTTP method of the endpoint (ex.: GET, POST...)
 *
 * @param {object} payload - Pairs of key - value items, where each key will
 *  represent a parameter
 * @param {function} validate - Method that will be used to perform the param
 *  validation. Different param types (path param, query param...) will use
 *  different validation methods. The used validation methods are currently
 *  defined in the "openapi-validator-utils" project.
 */
const paramsValidator = (endpoint, method) => (payload, validate) => {
  const keys = getKeys(payload);
  keys.forEach(key => {
    validate(payload[key], key, endpoint, method);
  });
};

/**
 * This methods format URL
 *  input: /test/:id
 *  output: /test/{id}
 * @param {object} req express request object
 * @return {string}
 */
const formatURL = req => {
  const params = Object.keys(req.params);
  let url = req.route.path;
  if (req.baseUrl !== req.route.path) {
    url = `${req.baseUrl}${req.route.path}`;
  }
  return params.reduce((acum, param) => (
    acum.replace(`:${param}`, `{${param}}`)
  ), url);
};

/**
 * @param {object} req express request object
 */
const getParameters = req => {
  const [contentType] = req.headers['content-type']
    ? req.headers['content-type'].split(';') : ['application/json'];
  const method = req.method.toLowerCase();
  // eslint-disable-next-line no-underscore-dangle
  const endpoint = formatURL(req);
  const requestBody = req.body;
  return {
    contentType,
    method,
    endpoint,
    requestBody,
  };
};

/**
 * @param {object} paramObject
 */
const formatParam = paramObject => paramKey => ({
  [paramKey]: paramObject[paramKey],
});

/**
 * @param {object} req express request object
 * @return {object[]}
 */
const paramsArray = req => ([
  ...Object.keys(req.query).map(formatParam(req.query)),
  ...Object.keys(req.params).map(formatParam(req.params)),
  ...Object.keys(req.headers).map(formatParam(req.headers)),
]);

const handleError = (error, errorStatusCode, next) => {
  const errorObject = {
    ...error,
    status: errorStatusCode,
    statusCode: errorStatusCode,
  };
  if (error.message.includes('Missing header')) {
    return next();
  }
  return next(errorObject);
};

/**
 *  Generates a copy of the given object by excluding all of the undefined
 * properties within the original.
 *
 * @param {object} value - Object to clean
 * @returns {object} Object without undefined properties
 */
const filterUndefinedProps = value => JSON.parse(JSON.stringify(value));

module.exports = {
  getKeys,
  paramsValidator,
  getParameters,
  paramsArray,
  handleError,
  filterUndefinedProps,
};
