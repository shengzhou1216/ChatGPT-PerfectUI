/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @param {boolean} ignoreEmptyKey - ignore empty value key. Default true
 * @returns {Object}
 */
const pick = (object, keys, ignoreEmptyKey = true) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      if (ignoreEmptyKey) {
        if (object[key] !== undefined && object[key] !== null && !!object[key])

          obj[key] = object[key]
      }
      else {
        obj[key] = object[key]
      }
    }
    return obj
  }, {})
}

export default pick
