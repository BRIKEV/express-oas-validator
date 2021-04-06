const DEFAULT_CONFIG = {
  body: true,
  params: true,
  headers: true,
  query: true,
  required: true,
};

/**
 * @param {object} config
 */
const getConfig = config => {
  if (!config || Object.keys(config).length === 0) return DEFAULT_CONFIG;
  return {
    DEFAULT_CONFIG,
    ...config,
  };
};

module.exports = getConfig;
