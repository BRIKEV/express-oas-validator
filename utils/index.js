const getKeys = (paramObject, exceptions = []) => (
  Object.keys(paramObject)
    .filter(key => !exceptions.includes(key))
);

const paramsValidator = (endpoint, method) => (payload, keys, validate) => {
  keys.forEach(key => {
    validate(payload[key], key, endpoint, method);
  });
};

const getParameters = req => {
  const contentType = req.headers['content-type'] || 'application/json';
  const method = req.method.toLowerCase();
  // eslint-disable-next-line no-underscore-dangle
  const endpoint = req._parsedUrl.path;
  const requestBody = req.body;
  return {
    contentType,
    method,
    endpoint,
    requestBody,
  };
};

module.exports = {
  getKeys,
  paramsValidator,
  getParameters,
};
