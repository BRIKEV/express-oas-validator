const getKeys = (paramObject, exceptions = []) => (
  Object.keys(paramObject)
    .filter(key => !exceptions.includes(key))
);

const paramsValidator = (endpoint, method) => (payload, keys, validate) => {
  keys.forEach(key => {
    validate(payload[key], key, endpoint, method);
  });
};

const formatURL = req => {
  const params = Object.keys(req.params);
  return params.reduce((acum, param) => (
    acum.replace(`:${param}`, `{${param}}`)
  ), req.route.path);
};

const getParameters = req => {
  const contentType = req.headers['content-type'] || 'application/json';
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

const formatParam = paramObject => paramKey => ({
  [paramKey]: paramObject[paramKey],
});

const paramsArray = req => ([
  ...Object.keys(req.query).map(formatParam(req.query)),
  ...Object.keys(req.params).map(formatParam(req.params)),
  ...Object.keys(req.headers).map(formatParam(req.headers)),
]);

module.exports = {
  getKeys,
  paramsValidator,
  getParameters,
  paramsArray,
};
