const PillowRequest = require('./lib/PillowRequest');

/**
 * @function getRequest
 * @description This function returns a PillowRequest object, allowing you to build the REST request using the provided step-wise functions
 * @param {boolean} [useHttps=false] - true if https should be used, false otherwise
 * @returns {PillowRequest}
 */
module.exports.getRequest = (useHttps=false) => {
  return new PillowRequest(useHttps);
}

/**
 * @function get
 * @description This function performs a GET request using the provided inputs
 * @param {string} url - the full destination url for the request
 * @param {{headers?: {[header: string]: string|string[]}, params?: {[param: string]: string|string[]}}} options - the headers and parameters to send with the request
 * @param {{username?: string, password?: string, token?: string}} [auth] - the username and password or token value to use for authentication
 * @param {boolean} [withCredentials=false] - if true and executing in a browser, stores the cookies sent in the request response; if false, does not
 * @param {(error, response, body) => {}} [callback] - an anonymous function to use as a callback; if provided, executes the callback with the response information
 * @returns {Promise<{error: Error, response: Object, body: Object}>} Returns a promise of the response information if no callback was provided
 */
module.exports.get = async (url, options, auth, withCredentials=false, callback) => {
  // Create the request object and set the main request parameters
  const request = new PillowRequest();
  request.get(url).options(options).withCredentials(withCredentials);

  // Add the provided type of auth
  if (auth && auth.username && auth.password) {
    request.authByUser(auth.username, auth.password);
  } else if (auth && auth.token) {
    request.authByToken(auth.token);
  }

  // Add the callback or return a promise
  if (callback && typeof callback === 'function') {
    request.callback(callback).call();
    return;
  } else {
    return await request.call();
  }
}

/**
 * @function post
 * @description This function performs a POST request using the provided inputs
 * @param {string} url - the full destination url for the request
 * @param {any} body - the payload to be sent in the request
 * @param {{headers?: {[header: string]: string|string[]}, params?: {[param: string]: string|string[]}}} options - the headers and parameters to send with the request
 * @param {{username?: string, password?: string, token?: string}} [auth] - the username and password or token value to use for authentication
 * @param {boolean} [withCredentials=false] - if true and executing in a browser, stores the cookies sent in the request response; if false, does not
 * @param {(error, response, body) => {}} [callback] - an anonymous function to use as a callback; if provided, executes the callback with the response information
 * @returns {Promise<{error: Error, response: Object, body: Object}>} Returns a promise of the response information if no callback was provided
 */
module.exports.post = async (url, body, options, auth, withCredentials=false, callback) => {
  // Create the request object and set the main request parameters
  const request = new PillowRequest();
  request.post(url).setBody(body).options(options).withCredentials(withCredentials);

  // Add the provided type of auth
  if (auth && auth.username && auth.password) {
    request.authByUser(auth.username, auth.password);
  } else if (auth && auth.token) {
    request.authByToken(auth.token);
  }

  // Add the callback or return a promise
  if (callback && typeof callback === 'function') {
    request.callback(callback).call();
    return;
  } else {
    return await request.call();
  }
}

/**
 * @function put
 * @description This function performs a PUT request using the provided inputs
 * @param {string} url - the full destination url for the request
 * @param {any} body - the payload to be sent in the request
 * @param {{headers?: {[header: string]: string|string[]}, params?: {[param: string]: string|string[]}}} options - the headers and parameters to send with the request
 * @param {{username?: string, password?: string, token?: string}} [auth] - the username and password or token value to use for authentication
 * @param {boolean} [withCredentials=false] - if true and executing in a browser, stores the cookies sent in the request response; if false, does not
 * @param {(error, response, body) => {}} [callback] - an anonymous function to use as a callback; if provided, executes the callback with the response information
 * @returns {Promise<{error: Error, response: Object, body: Object}>} Returns a promise of the response information if no callback was provided
 */
module.exports.put = async (url, body, options, auth, withCredentials=false, callback) => {
  // Create the request object and set the main request parameters
  const request = new PillowRequest();
  request.put(url).setBody(body).options(options).withCredentials(withCredentials);

  // Add the provided type of auth
  if (auth && auth.username && auth.password) {
    request.authByUser(auth.username, auth.password);
  } else if (auth && auth.token) {
    request.authByToken(auth.token);
  }

  // Add the callback or return a promise
  if (callback && typeof callback === 'function') {
    request.callback(callback).call();
    return;
  } else {
    return await request.call();
  }
}

/**
 * @function patch
 * @description This function performs a PATCH request using the provided inputs
 * @param {string} url - the full destination url for the request
 * @param {any} body - the payload to be sent in the request
 * @param {{headers?: {[header: string]: string|string[]}, params?: {[param: string]: string|string[]}}} options - the headers and parameters to send with the request
 * @param {{username?: string, password?: string, token?: string}} [auth] - the username and password or token value to use for authentication
 * @param {boolean} [withCredentials=false] - if true and executing in a browser, stores the cookies sent in the request response; if false, does not
 * @param {(error, response, body) => {}} [callback] - an anonymous function to use as a callback; if provided, executes the callback with the response information
 * @returns {Promise<{error: Error, response: Object, body: Object}>} Returns a promise of the response information if no callback was provided
 */
module.exports.patch = async (url, body, options, auth, withCredentials=false, callback) => {
  // Create the request object and set the main request parameters
  const request = new PillowRequest();
  request.patch(url).setBody(body).options(options).withCredentials(withCredentials);

  // Add the provided type of auth
  if (auth && auth.username && auth.password) {
    request.authByUser(auth.username, auth.password);
  } else if (auth && auth.token) {
    request.authByToken(auth.token);
  }

  // Add the callback or return a promise
  if (callback && typeof callback === 'function') {
    request.callback(callback).call();
    return;
  } else {
    return await request.call();
  }
}

/**
 * @function delete
 * @description This function performs a DELETE request using the provided inputs
 * @param {string} url - the full destination url for the request
 * @param {{headers?: {[header: string]: string|string[]}, params?: {[param: string]: string|string[]}}} options - the headers and parameters to send with the request
 * @param {{username?: string, password?: string, token?: string}} [auth] - the username and password or token value to use for authentication
 * @param {boolean} [withCredentials=false] - if true and executing in a browser, stores the cookies sent in the request response; if false, does not
 * @param {(error, response, body) => {}} [callback] - an anonymous function to use as a callback; if provided, executes the callback with the response information
 * @returns {Promise<{error: Error, response: Object, body: Object}>} Returns a promise of the response information if no callback was provided
 */
module.exports.delete = async (url, options, auth, withCredentials=false, callback) => {
  // Create the request object and set the main request parameters
  const request = new PillowRequest();
  request.delete(url).options(options).withCredentials(withCredentials);

  // Add the provided type of auth
  if (auth && auth.username && auth.password) {
    request.authByUser(auth.username, auth.password);
  } else if (auth && auth.token) {
    request.authByToken(auth.token);
  }

  // Add the callback or return a promise
  if (callback && typeof callback === 'function') {
    request.callback(callback).call();
    return;
  } else {
    return await request.call();
  }
}
