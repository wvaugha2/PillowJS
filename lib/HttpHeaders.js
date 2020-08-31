const { isArrayOfStr } = require('./util');
const clone = require('rfdc')({ proto: true });

class HttpHeaders {
  #headers = null;        // The dictionary of headers and their respective values

  /**
   * @function constructor
   * @param {{[header: string] : string | string[]}} headers - the headers object of key-value pairs to be set
   */
  constructor(headers=undefined) {
    this.#headers = {};
    if (typeof headers !== 'object') {
      return;
    } else {
      // If a headers object was provided, validate each header and store its value
      const headersKeys = Object.keys(headers);
      for (let i = 0; i < headersKeys.length; i++) {
        const key = headersKeys[i];
        if (typeof key === 'string') {
          const value = headers[key];
          if (typeof value === 'string' || isArrayOfStr(value)) {
            this.addHeader(key, value);
          }
        }
      }
    }
  }

  /**
   * @function addHeader
   * @description This function adds the provided header value to the specified header key
   * @param {string} key - the header to be set
   * @param {string|string[]} value - the value of the header being set
   * @returns {void}
   */
  addHeader(key, value) {
    if (key && typeof key === 'string' && value && (typeof value === 'string' || isArrayOfStr(value))) {
      if (!this.#headers) { // if the #headers property is missing, add it
        this.#headers = {};
      }
      if (!this.#headers[key]) { // if the header key is missing, add an array for it
        this.#headers[key] = [];
      }

      // Append or concat the new values based on the datatype of the value
      if (typeof value === 'string') {
        this.#headers[key].push(value);
      } else {
        this.#headers[key] = this.#headers[key].concat(value);
      }
    }
  }

  /**
   * @function removeHeader
   * @description This function removes the specified header. If a value is provided, only the specified value for the header will be removed.
   * @param {string} key - the header to be removed
   * @param {string} [value=undefined] - the value of the header being removed
   * @returns {void}
   */
  removeHeader(key, value=undefined) {
    if (this.#headers && typeof this.#headers === 'object') {
      if (key && typeof key === 'string' && this.#headers[key] && Array.isArray(this.#headers[key])) {
        if (value && typeof value === 'string') {
          const index = this.#headers[key].indexOf(value);
          if (index !== -1) {
            this.#headers[key].splice(index, 1);
          }
        } else if (value === undefined) {
          delete this.#headers[key];
        }
      }
    }
  }

  /**
   * @function getAllHeaders
   * @description This function provides access to the full headers object
   * @params {boolean} asHttpHeaders - if true, returns the object as expected within the actual request payload; else the #headers object
   * @returns {{[header: string] : string[]}}
   */
  getAllHeaders(asHttpHeaders=false) {
    if (asHttpHeaders) {
      const httpHeaders = {};
      const headersKeys = Object.keys(this.#headers);
      for (let i = 0; i < headersKeys.length; i++) {
        const key = headersKeys[i];
        const headerValues = this.#headers[key];
        if (isArrayOfStr(headerValues)) {
          httpHeaders[key.toLowerCase()] = headerValues.join();
        }
      }
      return httpHeaders;
    } else {
      return clone(this.#headers);
    }
  }

  /**
   * @function getHeader
   * @description This function returns the value of a specific header
   * @param {*} key - the header to be returned
   * @returns {string[]} the values of the header, or null if the header does not exist
   */
  getHeader(key) {
    if (key && typeof key === 'string') {
      return this.#headers[key] ? this.#headers[key] : null;
    }
  }

  /**
   * @function checkForHeader
   * @description This function checks to see if the header has already been entered, and if so, returns the value
   * @param {string} key - the header to check for
   * @returns {string} the header key that should be used to store values under, or null if an invalid key was provided
   */
  checkForHeader(key) {
    if (this.#headers && key && typeof key === 'string') {
      const testKey = key.toLowerCase();
      const headerKeys = Object.keys(this.#headers).map((k) => k.toLowerCase());
      for (let i = 0; i < headerKeys.length; i++) {
        // If the key has already been entered, return the key currently stored
        if (testKey === headerKeys[i]) {
          return headerKeys[i];
        }
      }
      return key;
    } else if (typeof key === 'string') { // If no headers have been provided, return the provided key
      return key;
    } else { // If the input was invalid, return null
      return null;
    }
  }

  /**
   * @function clearHeaders
   * @description This function completely resets the header values
   * @returns {void}
   */
  clearHeaders() {
    this.#headers = {};
  }
}

module.exports = { HttpHeaders };