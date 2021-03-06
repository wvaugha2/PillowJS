# PillowJS

## REST Easy with PillowJS!
Our goal is to give you the tools to easily perform REST calls the way you want, using a library that won't be deprecated anytime soon! With the pillow-rest-js package, you'll be able to make calls using simplified functions for each REST method, or build requests step by step using our step-wise methods.

[![NPM](https://nodei.co/npm/pillow-rest-js.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/pillow-rest-js/)

[![Build Status](https://travis-ci.com/wvaugha2/PillowJS.svg?branch=master)](https://travis-ci.com/wvaugha2/PillowJS)
[![Vulnerabilities](https://snyk.io/test/github/wvaugha2/PillowJs/badge.svg)](https://snyk.io/test/github/wvaugha2/PillowJS)
[![GitHub license](https://img.shields.io/github/license/wvaugha2/PillowJS)](https://github.com/wvaugha2/PillowJS/blob/master/LICENSE)

## Incredibly easy to get started
Making a request with PillowJS is as simple as it is shown below
```javascript
// Import the package
const pillow = require('pillow-rest-js');

// Create and perform the request
const request = pillow.getRequest();
const response = await request.get('http://destination.com').call()
```

## Table of Contents
- [Making a Request](#making-a-request)
  - [Step-wise Requests](#step-wise-request-building)
  - [Standardized Requests](#standardized-request-methods)
  - [Uncommon Request Methods](#uncommon-request-methods)
- [Callbacks and Promises](#callbacks-or-promises)
- [Future Updates](#future-updates)

## Making a Request
With PillowJS, we wanted to offer you the ability to build out the request by chaining functions in addition to provided standardized functions to perform GET, POST, PUT, PATCH, and DELETE calls.

### Step-wise Request Building
By using our step-wise request building, you can build the request object piece by piece, making it easy to visualize exactly what the request contains. Because you are building a request object, you can pass this object across functions, modify the request, and call it multiple times making it easy to store and reuse requests any way you like. 

Below is an example showing all of the methods available to be used to modify your request:
```javascript
// Create the request and specify which HTTP method and URL the request will use
const request = pillow.getRequest();
request.get('http://endpointUrl')

  // Perform Basic Auth or add a Bearer Token for authorization
  .authByUser('username', 'password')
  .authByToken('bearer token')

  // Modify the headers and query parameters for the request
  .options({ headers: {}, params: {} })
  .setHeaders({})
  .addHeader('header', 'value')
  .setParams({})
  .addParam('param', 'value')

  // Set the payload for the request
  .setBody(bodyData, '"content-type" header value')

  // Set how long to wait until timing out the request (in milliseconds)
  .setTimeout(12000)

  // If running in a browser, set the request to store cookies received in the response
  .withCredentials()

  // Instead of receiving a promise with the response data, set a callback to run
  .callback((error, response, body) => {})
  .onSuccess((response, body) => {})
  .onError((error) => {})

  // Call this method in order to kick off the request
  .call();

// Only call this method if you wish to reset all updates performed to class properties based on the other methods
request.reset();
```

Here's an example of making a request using the step-wise methods:
```javascript
const request = pillow.getRequest();
const response = await request.post('http://posturl.com').setBody({color: 'red'}).call();
```
[back to top](#table-of-contents)

### Standardized Request Methods
If you prefer to use a standardized way of performing your requests, we offer five methods, one for performing each of the five main Http methods.

Below is an example of what arguments these functions accept:
```javascript
// GET/DELETE Request
pillow.get/.delete(
  url: string,
  options: {headers?: {}, params?: {}},
  auth?: { username?: string, password?: string } || { token?: string },
  withCredentials?: boolean
  callback?: (error, response, body) => {}
)

// POST/PUT/PATCH Request
pillow.post/.put/.patch(
  url: string,
  body: any,
  options: {headers?: {}, params?: {}},
  auth?: { username?: string, password?: string } || { token?: string },
  withCredentials?: boolean
  callback?: (error, response, body) => {}
)
```

Here's an example of making the same request as above using the standardized methods:
```javascript
const response = await pillow.post('http://posturl.com', {color: 'red'});
```
[back to top](#table-of-contents)

### Uncommon Request Methods
What if you want to perform a HTTP method other than GET, POST, PUT, PATCH, or DELETE? You can create a request object and use two step-wise request methods: `setMethod` and `setUrl`:
```javascript
const request = pillow.getRequest();
request.setMethod('TRACE').setUrl('http://traceurl.com');
```
[back to top](#table-of-contents)

## Callbacks or Promises?
You do you, big dog! With PillowJS, you can choose to use callbacks or promises. You can specify a general callback to handle both success and error responses, a separate callback for both success and error, or no callbacks to receive a Promise. See the examples below of how to make a REST call in all three ways:
```javascript
// Process the response from downstream using a single callback
const request = pillow.getRequest();
request.get('http://endpointUrl')
  .callback((error, response, body) => {})
  .call();

// Process the responses from downstream using a success and error callback
const request = pillow.getRequest();
request.get('http://endpointUrl')
  .onSuccess((response, body) => {})
  .onError((error) => {})
  .call();

// Get the direct response from downstream as a JSON Promise containing the properties error, response, and body
const request = pillow.getRequest();
const result = await request.get('http://endpointUrl').call();
```
[back to top](#table-of-contents)

## Future Updates
With PillowJS, our goal is to continue to expand the capabilities so that it can be the easiest go-to solution for making Http calls. This includes adding support for features such as streaming requests, piping requests together, supporting form data as a specific payload type that can be used, and more.

If you'd like to help make PillowJS the best it can be, contact us through Github!

[back to top](#table-of-contents)

# Documentation (Work In Progress)
This section contains documentation for the methods and classes established within this package.

## Standardized Request Methods
These methods provide simple, standardized ways for performing the five most common request methods. These methods are built to be familiar with those established by other Node-based libraries.

### `get(url: string, options: {headers?: HttpHeaders|{[header: string]: string|string[]}, params?: HttpParams|{[param: string]: string|string[]}}, auth: {username?: string, password?: string, token?: string}, withCredentials: boolean, callback: (error, response, body) => {}): Promise<{error: Error, response: Object, body: Object}>`
- `url`: the full base URL for where the request will be made to
- `options`: an object containing both the headers and query parameters to be set for the request
- `auth`: an object containing a username and password for Basic Auth, or a token value to be assigned to the Authorization header
- `withCredentials`: if true and if running in a browser, will store all cookies received from the request; if false, or if not running in a browser, will not store cookies from the request. Value is false by default
- `callback`: if provided, the error, response, and response body will be passed into the given function; otherwise, a Promise containing the error, response, and response body will be returned

### `post(url: string, body: any, options: {headers?: HttpHeaders|{[header: string]: string|string[]}, params?: HttpParams|{[param: string]: string|string[]}}, auth: {username?: string, password?: string, token?: string}, withCredentials: boolean, callback: (error, response, body) => {}): Promise<{error: Error, response: Object, body: Object}>`
- `url`: the full base URL for where the request will be made to
- `body`: the data to be sent as the request's payload
- `options`: an object containing both the headers and query parameters to be set for the request
- `auth`: an object containing a username and password for Basic Auth, or a token value to be assigned to the Authorization header
- `withCredentials`: if true and if running in a browser, will store all cookies received from the request; if false, or if not running in a browser, will not store cookies from the request. Value is false by default
- `callback`: if provided, the error, response, and response body will be passed into the given function; otherwise, a Promise containing the error, response, and response body will be returned

### `put(url: string, body: any, options: {headers?: HttpHeaders|{[header: string]: string|string[]}, params?: HttpParams|{[param: string]: string|string[]}}, auth: {username?: string, password?: string, token?: string}, withCredentials: boolean, callback: (error, response, body) => {}): Promise<{error: Error, response: Object, body: Object}>`
- `url`: the full base URL for where the request will be made to
- `body`: the data to be sent as the request's payload
- `options`: an object containing both the headers and query parameters to be set for the request
- `auth`: an object containing a username and password for Basic Auth, or a token value to be assigned to the Authorization header
- `withCredentials`: if true and if running in a browser, will store all cookies received from the request; if false, or if not running in a browser, will not store cookies from the request. Value is false by default
- `callback`: if provided, the error, response, and response body will be passed into the given function; otherwise, a Promise containing the error, response, and response body will be returned

### `patch(url: string, body: any, options: {headers?: HttpHeaders|{[header: string]: string|string[]}, params?: HttpParams|{[param: string]: string|string[]}}, auth: {username?: string, password?: string, token?: string}, withCredentials: boolean, callback: (error, response, body) => {}): Promise<{error: Error, response: Object, body: Object}>`
- `url`: the full base URL for where the request will be made to
- `body`: the data to be sent as the request's payload
- `options`: an object containing both the headers and query parameters to be set for the request
- `auth`: an object containing a username and password for Basic Auth, or a token value to be assigned to the Authorization header
- `withCredentials`: if true and if running in a browser, will store all cookies received from the request; if false, or if not running in a browser, will not store cookies from the request. Value is false by default
- `callback`: if provided, the error, response, and response body will be passed into the given function; otherwise, a Promise containing the error, response, and response body will be returned

### `delete(url: string, options: {headers?: HttpHeaders|{[header: string]: string|string[]}, params?: HttpParams|{[param: string]: string|string[]}}, auth: {username?: string, password?: string, token?: string}, withCredentials: boolean, callback: (error, response, body) => {}): Promise<{error: Error, response: Object, body: Object}>`
- `url`: the full base URL for where the request will be made to 
- `options`: an object containing both the headers and query parameters to be set for the request
- `auth`: an object containing a username and password for Basic Auth, or a token value to be assigned to the Authorization header
- `withCredentials`: if true and if running in a browser, will store all cookies received from the request; if false, or if not running in a browser, will not store cookies from the request. Value is false by default
- `callback`: if provided, the error, response, and response body will be passed into the given function; otherwise, a Promise containing the error, response, and response body will be returned

## PillowRequest Class
This class maintains all information needed to perform a request built using the step-wise methods, including storing the request info, response info, and performing the request itself.

### `constructor(useHttps: boolean)`
This function creates a new instance of the PillowRequest class. 
- `useHttps`: if true, the request will use the HTTPS protocol to perform the request, otherwise it will default to using the HTTP protocol.

### `get(url: string)`
This function sets the PillowRequest class to use the GET request method.
- `url`: the full base URL for where the request will be made to

### `post(url: string)`
This function sets the PillowRequest class to use the POST request method.
- `url`: the full base URL for where the request will be made to

### `put(url: string)`
This function sets the PillowRequest class to use the PUT request method.
- `url`: the full base URL for where the request will be made to

### `patch(url: string)`
This function sets the PillowRequest class to use the PATCH request method.
- `url`: the full base URL for where the request will be made to

### `delete(url: string)`
This function sets the PillowRequest class to use the DELETE request method.
- `url`: the full base URL for where the request will be made to

### `setMethod(method: string)`
This function allows the user to specify whichever HTTP/HTTPS request method they wish to use. If this method is used, the user will also need to specify the request URL using the `setUrl` function
- `method`: the request method to be used, i.e. 'GET', 'TRACE', 'OPTIONS'; the value of the method string will be automatically capitalized for consistency

### `setUrl(url: string)`
This function sets the PillowRequest class to use the provided URL
- `url`: the full base URL for where the request will be made to

### `authByUser(un: string, pw: string)`
This function sets the username and password to be used to add a Basic-Auth Authorization header to the request
- `un`: the username value
- `pw`: the password value

### `authByToken(token: string)`
This function sets the Authorization header directly to the provided token value
- `token`: the password token that will be used as the value of the Authorization header

To Be Completed

## HttpHeaders Class
To be filled out

## HttpParams Class
To be filled out
