/**
 *  Checks if the value received by parameter is an array.
 *
 * @param {*} value - Value whose data type we want to check
 * @returns {boolean} Indicates if value is an array or not
 */
const isArray = value => Array.isArray(value);

/**
 *  Checks if the value received by parameter is an object.
 *
 * @param {*} value - Value whose data type we want to check
 * @returns {boolean} Indicates if value is an object or not
 */
const isObject = value => (typeof value === 'object' && value !== null);

/**
 *  If the received item is an object or an array, remove all of the undefined
 * properties in any of the objects within the whole node tree. Recursivity
 * will be used to achieve this.
 *
 * @param {*} item - Item to process
 * @param {function} processObject - Method to process an object instance
 * @param {function} processArray - Method to process an array instance
 * @returns {*} Processed item without undefined values in objects
 */
const processItem = (item, processObject, processArray) => {
  if (isArray(item)) {
    return processArray(item, processObject);
  }

  if (isObject(item)) {
    return processObject(item);
  }

  return item;
};

/**
 *  If the received item is an array, loop through all of its items to
 * remove any property with undefined values within nested objects at
 * any level.
 *
 * @param {array} array - Array to process
 * @param {function} processObject - Method to process an object instance
 * @returns {array} Processed array without undefined values in inner objects
 */
const processArray = (array, processObject) => array.map(item => (
  processItem(item, processObject, processArray)
));

/**
 *  Generates a copy of the given object by excluding all of the undefined
 * properties within the original.
 *
 * @param {object} object - Object to clean
 * @returns {object} Object without undefined properties
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

const filterUndefinedProps = value => processItem(value, processObject, processArray);

module.exports = filterUndefinedProps;
