/**
 * @function requestHelper
 * @description This function performs HTTP/HTTPS requests
 * @param {string} reqMethod - the REST method being used: GET, POST, PUT, DELETE, PATCH
 * @param {string} reqUrl - the url to send the request to
 * @param {Object} reqOptions - the options object to be sent with the request
 * @param {string|Object} [reqBody=undefined] - the request body
 * @param {boolean} [useHttps=false] - the http or https library to be used to make the downstream call
 * @returns {Promise<{requestError: Error, requestReturnObj: Object}>} An object containing the response from the downstream API and an error
 */
const requestHelper = async (reqMethod, reqUrl, reqOptions, reqBody=undefined, useHttps=false) => {
  return new Promise((resolve) => {
    try {
      // Initialize the request options if not provided and set the request method
      reqOptions = (!reqOptions) ? {} : reqOptions;
      reqOptions['method'] = reqMethod.toUpperCase();
      reqOptions['protocol'] = (useHttps) ? 'https:' : 'http:';

      // If the content-type header hasn't been set, set it
      if (reqBody && (!reqOptions['headers'] || !reqOptions['headers']['content-type'])) {
        if (!reqOptions['headers']) { reqOptions['headers'] = {}; }
        reqOptions['headers']['content-type'] = getContentType(reqBody);
      }

      // Initialize the request response object and error object
      const requestReturnObj = {
        requestUrl: reqUrl,
        responseHeaders: {},
        responseStatusCode: null,
        responseBody: {},
        responseError: null,
        elapsedTime: 0
      }

      // Use the desired http request library
      const httpLib = (useHttps) ? require('https') : require('http');

      // Parse the url and insert it into the request options object
      const urlObj = new URL(reqUrl);
      if (urlObj['host']) { reqOptions['host'] = urlObj['host']; }
      if (urlObj['port']) { reqOptions['port'] = urlObj['port']; }
      if (urlObj['path']) { reqOptions['path'] = urlObj['path']; }

      // Perform the HTTP/HTTPS request
      const startTime = Date.now();
      let req = httpLib.request(reqOptions, (res) => {
        const body = [];

        // Set the headers and statusCode
        requestReturnObj.responseStatusCode = res.statusCode || null;
        requestReturnObj.responseHeaders = res.headers || {};

        // Collect all data chunks received
        res.on('data', (chunk) => {
          body.push(chunk);
        });

        // Handle when the downstream response completes
        res.on('end', () => {
          // Create the response body from the received data chunks
          requestReturnObj.elapsedTime = Date.now() - startTime;
          try {
            requestReturnObj.responseBody = Buffer.concat(body).toString();
            resolve({ error: null, requestReturnObj: requestReturnObj });
          } catch (error) {
            resolve({ error: error, requestReturnObj: null });
          }
        });
      })

      // Send the request body if one was provided
      if (reqBody) {
        let bufferData = '';
        if (typeof reqBody === 'string') {
          bufferData = reqBody;
        } else if (typeof reqBody === 'object') {
          bufferData = JSON.stringify(reqBody);
        }
        req.write(Buffer.from(bufferData));
      }

      // Handle any request errors
      req.on('error', (error) => {
        requestReturnObj.elapsedTime = Date.now() - startTime;
        requestReturnObj.responseError = error.message;
        resolve({ error: null, requestReturnObj: requestReturnObj });
      });

      // End the request
      req.end();
    } catch (error) {
      // If a coding error occurred, return that error
      return resolve({ error: error, requestReturnObj: null });;
    }
  });
}

/**
 * @function getContentType
 * @description This function determines a default value for the content-type header if none was provided
 * @param {any} reqBody
 * @returns {string} the content-type of the request body
 */
const getContentType = (reqBody) => {
  if (typeof reqBody === 'string') {
    return 'text/plain';
  } else if (typeof reqBody === 'object') {
    return 'application/json';
  } else {
    return 'text/plain'; // Use plain text as the default value
  }
}

module.exports = { 
  requestHelper
}