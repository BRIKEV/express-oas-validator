const multiparty = require('multiparty');

/** @module Utils/files */

/**
 * Format files to return path
 * @param {object} files
 */
const formatFiles = files => (
  Object.keys(files).reduce((acum, fileKey) => (
    {
      ...acum,
      [fileKey]: files[fileKey][0].path,
    }
  ), {})
);

/**
 * Format fields to return the first value
 * @param {object} fields
 */
const formatFields = fields => (
  Object.keys(fields).reduce((acum, fileKey) => (
    {
      ...acum,
      [fileKey]: fields[fileKey][0],
    }
  ), {})
);

/**
 * This method retrieves the file object and form-data to validate it
 * @param {object} req express request
 */
const getFiles = req => (
  new Promise((resolve, reject) => {
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      const extendRequest = {
        ...formatFields(fields),
        ...formatFiles(files),
      };
      resolve(extendRequest);
    });
  })
);

module.exports = { getFiles };
