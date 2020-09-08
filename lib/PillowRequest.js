const { HttpHeaders } = require('./HttpHeaders');
const { HttpParams } = require('./HttpParams');
const { isArrayOfStr, useHttpsProtocol, getCookieNameAndValue } = require('./util');
const { requestHelper } = require('./requestHelper');
const jsCookie = require('js-cookie');

/**
 * @class PillowRequest
 * @description This class contains the operations needed to make a http request
 */
class PillowRequest {
  useHttps = null;            // either the http or https library

  // REQUEST PROPERTIES
  url = null;                 // the endpoint to hit
  method = null;              // the type of REST request being made: 'GET', 'POST', 'PUT', 'DELETE', 'PATCH'
  authUN = null;              // the username to be used when making the request
  authPW = null;              // the password to be used when making the request
  token = null;               // the token to use for authorization
  headers = null;             // the object containing all headers for the request
  params = null;              // the object containing all parameters for the request
  body = null;                // the data that will be sent as the request body
  contentType = null;         // the content-type header value for the body
  withCreds = false;          // if true, accept cookies from the response; otherwise do not
  timeout = null;             // the number of milliseconds to wait for a response until the socket disconnects

  // RESPONSE PROPERTIES
  response = null;            // Contains the full JSON response object retrieved from downstream
  responseError = null;       // Contains the error if an error occurred
  responseBody = null;        // Contains the response body if the downstream system responded

  // CALLBACK FUNCTIONS
  generalCallback = null;     // general callback to handle success and failure
  successCallback = null;     // optional callback to hit; if not provided, returns a Promise
  errorCallback = null;       // optional callback to hit on success

  /**
   * @constructor
   * @param {boolean} [useHttps=false] - true if https should be used, false otherwise; This will be overwritten with the protocol in the provided url
   */
  constructor(useHttps=false) {
    this.useHttps = (useHttps) ? true : false;
  }

  /**
   * @function get
   * @description This functions sets the request object to peform a GET call on the provided URL
   * @param {string} url - the request URL
   * @returns {PillowRequest}
   */
  get(url) {
    if (url && typeof url === 'string') {
      this.method = 'GET';
      this.url = url;
      const useHttps = useHttpsProtocol(this.url);
      this.useHttps = (useHttps === null) ? this.useHttps : useHttps; // if null is returned, keep the current setting
    }
    return this;
  }

  /**
   * @function post
   * @description This functions sets the request object to peform a POST call on the provided URL
   * @param {string} url - the request URL
   * @returns {PillowRequest}
   */
  post(url) {
    if (url && typeof url === 'string') {
      this.method = 'POST';
      this.url = url;
      const useHttps = useHttpsProtocol(this.url);
      this.useHttps = (useHttps === null) ? this.useHttps : useHttps; // if null is returned, keep the current setting
    }
    return this;
  }

  /**
   * @function put
   * @description This functions sets the request object to peform a PUT call on the provided URL
   * @param {string} url - the request URL
   * @returns {PillowRequest}
   */
  put(url) {
    if (url && typeof url === 'string') {
      this.method = 'PUT';
      this.url = url;
      const useHttps = useHttpsProtocol(this.url);
      this.useHttps = (useHttps === null) ? this.useHttps : useHttps; // if null is returned, keep the current setting
    }
    return this;
  }

  /**
   * @function patch
   * @description This functions sets the request object to peform a PATCH call on the provided URL
   * @param {string} url - the request URL
   * @returns {PillowRequest}
   */
  patch(url) {
    if (url && typeof url === 'string') {
      this.method = 'PATCH';
      this.url = url;
      const useHttps = useHttpsProtocol(this.url);
      this.useHttps = (useHttps === null) ? this.useHttps : useHttps; // if null is returned, keep the current setting
    }
    return this;
  }

  /**
   * @function delete
   * @description This functions sets the request object to peform a DELETE call on the provided URL
   * @param {string} url - the request URL
   * @returns {PillowRequest}
   */
  delete(url) {
    if (url && typeof url === 'string') {
      this.method = 'DELETE';
      this.url = url;
      const useHttps = useHttpsProtocol(this.url);
      this.useHttps = (useHttps === null) ? this.useHttps : useHttps; // if null is returned, keep the current setting
    }
    return this;
  }

  /**
   * @function setMethod
   * @description This function sets the request method; useful if the user wants to use one that is not GET, POST, PUT, PATCH, or DELETE
   * @param {string} method - the HTTP method to be used for the request
   * @returns {PillowRequest}
   */
  setMethod(method) {
    if (method && typeof method === 'string') {
      this.method = method.toUpperCase();
    }
    return this;
  }

  /**
   * @function setUrl
   * @description This function sets the request url; useful if the user is not using one of the five main request methods
   * @param {string} url - the URL to send the request to
   * @returns {PillowRequest}
   */
  setUrl(url) {
    if (url && typeof url === 'string') {
      this.url = url;
      const useHttps = useHttpsProtocol(this.url);
      this.useHttps = (useHttps === null) ? this.useHttps : useHttps; // if null is returned, keep the current setting
    }
    return this;
  }

  /**
   * @function authByUser
   * @description This function adds a username and password to the request for setting the 'authorization' header using Basic Auth
   * @param {string} un - the username value
   * @param {string} pw - the password value
   * @returns {PillowRequest}
   */
  authByUser(un, pw) {
    if (typeof un === 'string' && typeof pw === 'string') {
      this.authUN = un;
      this.authPW = pw;
    }
    return this;
  }

  /**
   * @function authByToken
   * @description This function adds a bearer token to perform authentication with
   * @param {string} token - the authentication bearer token value
   * @returns {PillowRequest}
   */
  authByToken(token) {
    this.token = (typeof token === 'string') ? token : null;
    return this;
  }

  /**
   * @function options
   * @description This function adds the specified headers and params to the request object
   * @param {{headers?: HttpHeaders|{[header:string]: string|string[]}, params?: HttpParams|{[param:string]: string|string[]}}} options - an object containing the headers and query params to be set for the request
   * @returns {PillowRequest}
   */
  options(options) {
    if (typeof options === 'object') {
      if (options['headers']) {
        this.headers = (options['headers'] instanceof HttpHeaders) ? options['headers'] : new HttpHeaders(options['headers']);
      }
      if (options['params']) {
        this.params = (options['params'] instanceof HttpParams) ? options['params'] : new HttpParams(options['params']);
      }
    }
    return this;
  }

  /**
   * @function setHeaders
   * @description This function sets the request's headers to be the values provided
   * @param {{[header:string]: string|string[]}} headers - the dictionary of header values to be added to the request; will overwrite any existing headers
   * @returns {PillowRequest}
   */
  setHeaders(headers) {
    if (typeof headers === 'object') {
      this.headers = (headers instanceof HttpHeaders) ? headers : new HttpHeaders(headers);
    }
    return this;
  }

  /**
   * @function addHeader
   * @description This function adds the provided header and header value to the request
   * @param {string} key - the header to be added
   * @param {string|string[]} value - the value(s) of the header
   * @returns {PillowRequest}
   */
  addHeader(key, value) {
    if (typeof key === 'string' && (typeof value === 'string' || isArrayOfStr(value))) {
      if (this.headers && this.headers instanceof HttpHeaders) {
        this.headers.addHeader(key, value);
      } else {
        let tmpHeaders = {};
        tmpHeaders[key] = value;
        this.headers = new HttpHeaders(tmpHeaders);
      }
    }
    return this;
  }

  /**
   * @function setParams
   * @description This function assigns an object of param key-value pairs to be used as the request's query parameters
   * @param {{[param:string]: string|string[]}} params - the dictionary of param values to be added to the request; will overwrite any existing params
   * @returns {PillowRequest}
   */
  setParams(params) {
    if (typeof params === 'object') {
      this.params = (params instanceof HttpParams) ? params : new HttpParams(params);
    }
    return this;
  }

  /**
   * @function addParam
   * @description This function adds the provided param and param value to the request
   * @param {string} key - the param to be added
   * @param {string|string[]} value - the value(s) of the param
   * @returns {PillowRequest}
   */
  addParam(key, value) {
    if (typeof key === 'string' && (typeof value === 'string' || isArrayOfStr(value))) {
      if (this.params && this.params instanceof HttpParams) {
        this.params.addParam(key, value);
      } else {
        let tmpHeaders = {};
        tmpHeaders[key] = value;
        this.params = new HttpParams(tmpHeaders);
      }
    }
    return this;
  }

  /**
   * @function setBody
   * @description This function sets the body that will be sent in the request
   * @param {any} body - the data to be set as the request body
   * @param {string} [contentType=undefined] - the value of the content-type header for the request
   * @returns {PillowRequest}
   */
  setBody(body, contentType=undefined) {
    if (body) {
      this.body = body;
      if (typeof contentType === 'string') {
        this.contentType = contentType;
      }
    }
    return this;
  }

  /**
   * @function withCredentials
   * @description This function will set the request to accept cookies from the response
   * @param {boolean} [value=true] - if true, accept cookies from the response; By default, requests do not accept cookies from the response. 
   * @returns {PillowRequest}
   */
  withCredentials(value=true) {
    this.withCreds = (value) ? true : false;
    return this;
  }

  /**
   * @function setTimeout
   * @description This function sets the max time to wait for a request to finish
   * @param {number} time - the number of milliseconds to wait for the request to finish before closing the connection
   * @returns {PillowRequest}
   */
  setTimeout(time) {
    if (typeof time === 'number') {
      this.timeout = time;
    }
    return this;
  }

  /**
   * @function setCallback
   * @description This function adds a callback that will handle both successful and error response from downstream
   * @param {Function} callback - the callback that will be performed, taking in inputs (error, response, body)
   *  - error: the error that occurred (if one occurred)
   *  - response: the full response returned from making the request
   *  - body: the response body on a successful response, in the specified responseType
   * @returns {PillowRequest}
   */
  callback(callback) {
    if (typeof callback === 'function') {
      this.generalCallback = callback;
    }
    return this;
  }

  /**
   * @function onSuccess
   * @description This function adds a callback that will handle a successful response from downstream
   * @param {Function} callback - the callback that will be performed, taking in inputs (response, body)
   *  - response: the full response returned from making the request
   *  - body: the response body on a successful response, in the specified responseType
   * @returns {PillowRequest}
   */
  onSuccess(callback) {
    if (typeof callback === 'function') {
      this.successCallback = callback;
    }
    return this;
  }

  /**
   * @function onError
   * @description This function adds a callback that will handle an error response from downstream
   * @param {Function} callback - the callback that will be performed, taking in inputs (error)
   *  - error: the error that occurred (if one occurred)
   * @returns {PillowRequest}
   */
  onError(callback) {
    if (typeof callback === 'function') {
      this.errorCallback = callback;
    }
    return this;
  }

  /**
   * @function call
   * @description Executes the request that has been set up
   * @returns {Promsie} If no callbacks were specified, returns a promise, otherwise returns void
   */
  async call() {
    // Initialize this.headers and this.params if not yet provided
    if (!this.headers || !(this.headers instanceof HttpHeaders)) { this.headers = new HttpHeaders(); }
    if (!this.params || !(this.params instanceof HttpParams)) { this.params = new HttpParams(); }

    // Set the content-type header if provided and not yet set
    let contentTypeKey = this.headers.checkForHeader('content-type');
    if (typeof this.contentType === 'string' && !this.headers.getHeader(contentTypeKey)) {
      this.headers.addHeader(contentTypeKey, this.contentType);
    }

    // Set the authorization header if not yet set and a username and password are provided
    let authorizationKey = this.headers.checkForHeader('authorization');
    if (typeof this.authUN === 'string' && typeof this.authPW === 'string' && !this.headers.getHeader(authorizationKey)) {
      const auth = 'Basic ' + Buffer.from(`${this.authUN}:${this.authPW}`).toString('base64');
      this.headers.addHeader(authorizationKey, auth);
    }
    // Set the authorization header if not yet set and a bearer token is provided
    if (typeof this.token === 'string' && !this.headers.getHeader(authorizationKey)) {
      this.headers.addHeader(authorizationKey, this.token);
    }

    // Create the final options object
    const optionsObj = {};
    if (this.headers instanceof HttpHeaders) { optionsObj.headers = this.headers.getAllHeaders(true); }
    if (this.timeout && typeof this.timeout === 'number') { optionsObj.timeout = this.timeout; }

    // Create the final url
    const queryParamStr = this.params.getAllParams(true);
    const fullUrl = `${this.url}${queryParamStr}`;

    // Perform the request
    const responseObj = await requestHelper(this.method, fullUrl, optionsObj, this.body, this.useHttps);

    // Update the response properties
    if (responseObj) {
      this.response = responseObj.requestReturnObj ? responseObj.requestReturnObj : null;
      this.responseError = responseObj.error ? responseObj.error : null;
      this.responseBody = this.response && this.response.responseBody ? this.response.responseBody : null;
    }

    // If withCredentials was specified and the request is executed within a browser, store the returned cookies
    if (this.withCreds && typeof window !== 'undefined' && typeof process !== 'object' ) {
      if (this.response && this.response.responseHeaders && this.response.responseHeaders['set-cookie'] && Array.isArray(this.response.responseHeaders['set-cookie'])) {
        const cookieArray = this.response.responseHeaders['set-cookie'];
        for (let i = 0; i < cookieArray.length; i++) {
          const cookieObj = getCookieNameAndValue(cookieArray[i]);
          if (cookieObj && cookieObj.name && cookieObj.value) {
            jsCookie.set(cookieObj.name, cookieObj.value);
          }
        }
      }
    }

    // Use a general callback for handling both response and error
    if (typeof this.generalCallback === 'function') {
      this.generalCallback(this.responseError, this.response, this.responseBody);
    } else {
      // Use an error callback if one was provided
      if (typeof this.errorCallback === 'function') {
        this.errorCallback(this.responseError);
      }

      // Use a success callback if one was provided
      if (typeof this.successCallback === 'function') {
        this.successCallback(this.response, this.responseBody)
      }

      // If no callbacks were provided, return a Promise containing the response, error, and body
      if (!(this.errorCallback && typeof this.errorCallback === 'function') && !(this.successCallback && typeof this.successCallback === 'function')) {
        return Promise.resolve({error: this.responseError, response: this.response, body: this.responseBody});
      }
    }
  }

  /**
   * @function reset
   * @description - This function resets all properties of the PillowRequest object
   * @returns {void}
   */
  reset() {
    this.useHttps = null;

    // REQUEST PROPERTIES
    this.url = null;
    this.method = null;
    this.authUN = null;
    this.authPW = null;
    this.token = null;
    this.headers = null;
    this.params = null;
    this.body = null;
    this.contentType = null;
    this.withCreds = false;
    this.timeout = null;

    // RESPONSE PROPERTIES
    this.response = null;
    this.responseError = null;
    this.responseBody = null;

    // CALLBACK FUNCTIONS
    this.generalCallback = null;
    this.successCallback = null;
    this.errorCallback = null;
  }

};

module.exports = PillowRequest;