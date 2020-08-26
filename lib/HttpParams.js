const { isArrayOfStr } = require('./util');
const clone = require('rfdc')({ proto: true });

const queryParamRegex = /^((?:[\?|&|;]{0,1})([^=]+)=([^&|;]+))+$/g;
const singleParamRegex = /^(?:[\?|&|;]{0,1})([^=]+)=([^&|;]+)$/;

class HttpParams {
  #params = null;         // The dictionary of params and their respective values

  /**
   * @function constructor
   * @param {string|{[param: string] : string | string[]}} params - the params string or object of key-value pairs to be set
   */
  constructor(params=undefined) {
    this.#params = {};
    if (typeof params === 'string') {
      // Verify that it is a valid parameter string
      if (queryParamRegex.test(params)) {
        const matches = params.match(queryParamRegex);
        if (Array.isArray(matches)) {
          for (let i = 0; i < matches.length; i++) {
            const groups = matches[i].match(singleParamRegex);
            // If a valid param/value pair is found, add it to the #params object
            if (Array.isArray(groups) && groups.length === 3) {
              const key = groups[1];
              const value = groups[2];
              this.addParam(key, value);
            }
          }
        }
      }
    } else if (typeof params === 'object') {
      // If a params object was provided, validate each param and store its value
      const paramsKeys = Object.keys(params);
      for (let i = 0; i < paramsKeys.length; i++) {
        const key = paramsKeys[i];
        if (typeof key === 'string') {
          let value = params[key];
          if (typeof value === 'string' || isArrayOfStr(value)) {
            this.addParam(key, value);
          } else {
            throw new Error(`The provided value for param ${key} must be a string: ${value}`)
          }
        } else {
          throw new Error(`The following param key must be a string: ${key}`);
        }
      }
    }
  }

  /**
   * @function addParam
   * @description This function adds the provided param value to the specified param key
   * @param {string} key - the param to be set
   * @param {string|string[]} value - the value of the param being set
   * @returns {void}
   */
  addParam(key, value) {
    if (key && typeof key === 'string' && value && (typeof value === 'string' || isArrayOfStr(value))) {
      if (!this.#params) { // if the #params property is missing, add it
        this.#params = {};
      }
      if (!this.#params[key]) { // if the param key is missing, add an array for it
        this.#params[key] = [];
      }

      // Append or concat the new values based on the datatype of the value
      if (typeof value === 'string') {
        this.#params[key].push(value);
      } else {
        this.#params[key] = this.#params[key].concat(value);
      }
    }
  }

  /**
   * @function removeParam
   * @description This function removes the specified param.
   * @param {string} key - the param to be removed
   * @param {string} [value=undefined] - the value of the param being removed
   * @returns {void}
   */
  removeParam(key, value=undefined) {
    if (this.#params && typeof this.#params === 'object') {
      if (key && typeof key === 'string' && this.#params[key] && Array.isArray(this.#params[key])) {
        if (value && typeof value === 'string') {
          const index = this.#params[key].indexOf(value);
          if (index !== -1) {
            this.#params[key].splice(index, 1);
          }
        } else if (value === undefined) {
          delete this.#params[key];
        }
      }
    }
  }

  /**
   * @function getAllParams
   * @description This function provides access to all of the specified params
   * @param {boolean} asString - if true, return the values as a query parameter string to be appended to the end of the URL with all param values URI-encoded, otherwise return the parameters object
   * @returns {string|{[param: string] : string[]}}
   */
  getAllParams(asString=false) {
    if (asString) {
      let queryParamStr = '';
      let paramKeys = Object.keys(this.#params);
      for (let i = 0; i < paramKeys.length; i++) {
        let key = paramKeys[i];
        let paramValues = this.#params[key];
        if (Array.isArray(paramValues)) {
          for (let j = 0; j < paramValues.length; j++) {
            let value = encodeURI(paramValues[j]);
            if (typeof value === 'string') {
              queryParamStr = queryParamStr ? `${queryParamStr}&${key}=${value}` : `?${key}=${value}`;
            }
          }
        }
      }
      return queryParamStr;
    } else {
      return clone(this.#params);
    }
  }

  /**
   * @function getParam
   * @description This function returns the value of a specific param
   * @param {*} key - the param to be returned
   * @returns {string} the value of the param, or null if the param does not exist
   */
  getParam(key) {
    if (key && typeof key === 'string') {
      return this.#params[key] ? this.#params[key] : null;
    }
  }

  /**
   * @function clearParams
   * @description This function completely resets the param values
   * @returns {void}
   */
  clearParams() {
    this.#params = {};
  }
}

module.exports = { HttpParams };