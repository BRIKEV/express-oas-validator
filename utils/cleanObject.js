const isArray = item => Array.isArray(item);
const isObject = item => (typeof item === 'object' && item !== null);

const processArray = (array, processObject) => array.map(item => {
  // if array, must run recursively
  if (isArray(item)) {
    return processArray(item, processObject);
  }

  // if object, return filterUndefinedProps
  if (isObject(item)) {
    return processObject(item);
  }

  // if basic value, return as it is
  return item;
});

/**
 *  Generates a copy of the given object by excluding all of the undefined
 * properties within the original.
 *
 * @param {object} object - Object to clean
 * @returns Object without undefined properties
 */
const processObject = object => {
  const cleanObject = {};

  Object.keys(object).forEach(key => {
    const value = object[key];

    if (isObject(value)) {
      if (!isArray(value)) {
        cleanObject[key] = processObject(value);
      } else {
        cleanObject[key] = processArray(value, processObject);
      }
    } else if (value !== undefined) {
      cleanObject[key] = value;
    }
  });

  return cleanObject;
};

const filterUndefinedProps = value => {
  if (isArray(value)) {
    return processArray(value, processObject);
  }

  if (isObject(value)) {
    return processObject(value);
  }

  return value;
};

module.exports = filterUndefinedProps;
