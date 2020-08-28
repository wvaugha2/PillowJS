const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;

const PillowRequest = require('../../lib/PillowRequest');
const { HttpHeaders } = require('../../lib/HttpHeaders');
const { HttpParams } = require('../../lib/HttpParams');

describe('PillowRequest constructor', () => {
  it('should be a new instance of PillowRequest', () => {
    const pr = new PillowRequest();
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('useHttps', false);
    expect(pr).to.have.property('url', null);
    expect(pr).to.have.property('method', null);
    expect(pr).to.have.property('authUN', null);
    expect(pr).to.have.property('authPW', null);
    expect(pr).to.have.property('headers', null);
    expect(pr).to.have.property('params', null);
    expect(pr).to.have.property('body', null);
    expect(pr).to.have.property('contentType', null);
    expect(pr).to.have.property('withCreds', false);
    expect(pr).to.have.property('timeout', null);
    expect(pr).to.have.property('response', null);
    expect(pr).to.have.property('responseError', null);
    expect(pr).to.have.property('responseBody', null);
    expect(pr).to.have.property('generalCallback', null);
    expect(pr).to.have.property('successCallback', null);
    expect(pr).to.have.property('errorCallback', null);
  });

  it('should initialize useHttps in constructor', () => {
    let pr = new PillowRequest(true);
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('useHttps');
    expect(pr.useHttps).to.equal(true);

    pr = new PillowRequest(false);
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('useHttps');
    expect(pr.useHttps).to.equal(false);
  });
});

describe('PillowRequest.get/.post/.put/.patch/.delete', () => {
  const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
  const getRequest = (method, pr, url) => {
    switch (method) {
      case 'GET':
        return pr.get(url)
      case 'POST':
        return pr.post(url)
      case 'PUT':
        return pr.put(url);
      case 'PATCH':
        return pr.patch(url);
      case 'DELETE':
        return pr.delete(url);
    }
  };

  it('should update the properties method, url and useHttps if a url string is provided with protocol', () => {
    for (let i = 0; i < methods.length; i++) {
      const method = methods[i];
      let pr = new PillowRequest();
      pr = getRequest(method, pr, 'https://localhost');
      expect(pr).to.be.instanceOf(PillowRequest);
      expect(pr).to.have.property('method');
      expect(pr.method).to.equal(method);
      expect(pr).to.have.property('url');
      expect(pr.url).to.equal('https://localhost');
      expect(pr).to.have.property('useHttps');
      expect(pr.useHttps).to.equal(true);
    }
  });

  it('should update the properties method, url if a url string is provided without a protocol', () => {
    for (let i = 0; i < methods.length; i++) {
      const method = methods[i];
      let pr = new PillowRequest();
      pr = getRequest(method, pr, 'localhost');
      expect(pr).to.be.instanceOf(PillowRequest);
      expect(pr).to.have.property('method');
      expect(pr.method).to.equal(method);
      expect(pr).to.have.property('url');
      expect(pr.url).to.equal('localhost');
      expect(pr).to.have.property('useHttps');
      expect(pr.useHttps).to.equal(false);
    }
  });

  it('should do nothing if an invalid input is provided', () => {
    for (let i = 0; i < methods.length; i++) {
      const method = methods[i];
      let pr = new PillowRequest();
      pr = getRequest(method, pr, 5);
      expect(pr).to.be.instanceOf(PillowRequest);
      expect(pr).to.have.property('method');
      expect(pr.method).to.equal(null);
      expect(pr).to.have.property('url');
      expect(pr.url).to.equal(null);
    }
  });
});

describe('PillowRequest.authByUser', () => {
  it('should set the username and password for basic auth if valid inputs are provided', () => {
    let pr = new PillowRequest();
    pr.authByUser('user', 'pass');
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('authUN');
    expect(pr.authUN).to.equal('user');
    expect(pr).to.have.property('authPW');
    expect(pr.authPW).to.equal('pass');
  });

  it('should not set the username and password for basic auth if an invalid input is provided', () => {
    let pr = new PillowRequest();
    pr.authByUser(5, 'pass');
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('authUN');
    expect(pr.authUN).to.equal(null);
    expect(pr).to.have.property('authPW');
    expect(pr.authPW).to.equal(null);
  });
});

describe('PillowRequest.authByToken', () => {
  it('should set the username and password for basic auth if valid inputs are provided', () => {
    let pr = new PillowRequest();
    pr.authByToken('value');
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('token');
    expect(pr.token).to.equal('value');
  });

  it('should not set the username and password for basic auth if an invalid input is provided', () => {
    let pr = new PillowRequest();
    pr.authByToken(8);
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('token');
    expect(pr.token).to.equal(null);
  });
});

describe('PillowRequest.options', () => {
  it('should set the headers and params properties only if they are provided', () => {
    let pr = new PillowRequest();
    pr.options({'headers': {}, 'params': {}});
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('headers');
    expect(pr.headers).to.be.instanceOf(HttpHeaders);
    expect(pr).to.have.property('params');
    expect(pr.params).to.be.instanceOf(HttpParams);

    pr = new PillowRequest();
    pr.options({});
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('headers');
    expect(pr.headers).to.equal(null);
    expect(pr).to.have.property('params');
    expect(pr.params).to.equal(null);
  });
});

describe('PillowRequest.setHeaders', () => {
  it('should set the headers property if it is provided', () => {
    let pr = new PillowRequest();
    pr.setHeaders({ h1: 'v1'});
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('headers');
    expect(pr.headers).to.be.instanceOf(HttpHeaders);
    const headers = pr.headers.getAllHeaders();
    expect(headers).to.have.property('h1');
    expect(headers.h1).to.eql(['v1']);
  });
});

describe('PillowRequest.addHeader', () => {
  it('should add the specified header if a valid key and value are provided', () => {
    let pr = new PillowRequest();
    pr.addHeader('h1', 'v1');
    pr.addHeader('h2', 'v2');
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('headers');
    expect(pr.headers).to.be.instanceOf(HttpHeaders);
    const headers = pr.headers.getAllHeaders();
    expect(headers).to.have.property('h1');
    expect(headers.h1).to.eql(['v1']);
    expect(headers).to.have.property('h2');
    expect(headers.h2).to.eql(['v2']);
  });
});

describe('PillowRequest.setParams', () => {
  it('should set the params property if it is provided', () => {
    let pr = new PillowRequest();
    pr.setParams({ p1: 'v1'});
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('params');
    expect(pr.params).to.be.instanceOf(HttpParams);
    const params = pr.params.getAllParams();
    expect(params).to.have.property('p1');
    expect(params.p1).to.eql(['v1']);
  });
});

describe('PillowRequest.setParams', () => {
  it('should add the specified param if a valid key and value are provided', () => {
    let pr = new PillowRequest();
    pr.addParam('p1', 'v1');
    pr.addParam('p2', 'v2');
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('params');
    expect(pr.params).to.be.instanceOf(HttpParams);
    const params = pr.params.getAllParams();
    expect(params).to.have.property('p1');
    expect(params.p1).to.eql(['v1']);
    expect(params).to.have.property('p2');
    expect(params.p2).to.eql(['v2']);
  });
});

describe('PillowRequest.setBody', () => {
  it('should add the body payload and, if specified, content type', () => {
    let pr = new PillowRequest();
    pr.setBody({});
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('body');
    expect(pr.body).to.eql({});
    expect(pr).to.have.property('contentType');
    expect(pr.contentType).to.equal(null);

    pr = new PillowRequest();
    pr.setBody({}, 'value');
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('body');
    expect(pr.body).to.eql({});
    expect(pr).to.have.property('contentType');
    expect(pr.contentType).to.equal('value');
  });
});

describe('PillowRequest.withCredentials', () => {
  it('should set the withCreds property to true or false', () => {
    let pr = new PillowRequest();
    pr.withCredentials();
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('withCreds');
    expect(pr.withCreds).to.equal(true);

    pr.withCredentials(false);
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('withCreds');
    expect(pr.withCreds).to.equal(false);
  });
});

describe('PillowRequest.setTimeout', () => {
  it('should set the timeout property if a valid input is provided', () => {
    let pr = new PillowRequest();
    pr.setTimeout(1000);
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('timeout');
    expect(pr.timeout).to.equal(1000);

    pr = new PillowRequest();
    pr.setTimeout();
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('timeout');
    expect(pr.timeout).to.equal(null);
  });
});

describe('PillowRequest.callback', () => {
  it('should set the generalCallback property if a valid input is provided', () => {
    let pr = new PillowRequest();
    pr.callback(() => {});
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('generalCallback');
    expect(pr.generalCallback).to.be.a('function');

    pr = new PillowRequest();
    pr.callback(5);
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('generalCallback');
    expect(pr.generalCallback).to.equal(null);
  });
});

describe('PillowRequest.onSuccess', () => {
  it('should set the successCallback property if a valid input is provided', () => {
    let pr = new PillowRequest();
    pr.onSuccess(() => {});
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('successCallback');
    expect(pr.successCallback).to.be.a('function');

    pr = new PillowRequest();
    pr.onSuccess(5);
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('successCallback');
    expect(pr.successCallback).to.equal(null);
  });
});

describe('PillowRequest.onError', () => {
  it('should set the errorCallback property if a valid input is provided', () => {
    let pr = new PillowRequest();
    pr.onError(() => {});
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('errorCallback');
    expect(pr.errorCallback).to.be.a('function');

    pr = new PillowRequest();
    pr.onError(5);
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('errorCallback');
    expect(pr.errorCallback).to.equal(null);
  });
});

describe('PillowRequest.onError', () => {
  it('should set the errorCallback property if a valid input is provided', () => {
    let pr = new PillowRequest();
    pr.onError(() => {});
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('errorCallback');
    expect(pr.errorCallback).to.be.a('function');

    pr = new PillowRequest();
    pr.onError(5);
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('errorCallback');
    expect(pr.errorCallback).to.equal(null);
  });
});

describe('PillowRequest.call', () => {
  it('should initialize headers and params properties if they have not been set', () => {
    let pr = new PillowRequest();
    pr.call();
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('headers');
    expect(pr.headers).to.be.instanceOf(HttpHeaders);
    expect(pr).to.have.property('params');
    expect(pr.params).to.be.instanceOf(HttpParams);
  });

  it('should set the content-type header if the contentType property has been set but the header has not', () => {
    let pr = new PillowRequest();
    pr.setBody({}, 'content');
    pr.call();
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('headers');
    expect(pr.headers).to.be.instanceOf(HttpHeaders);
    const headers = pr.headers.getAllHeaders();
    expect(headers).to.have.property('content-type');
    expect(headers['content-type']).to.eql(['content']);
  });

  it('should set the authorization header if it has not been set but basic or token auth info has been provided', () => {
    let pr = new PillowRequest();
    pr.authByUser('user', 'pass');
    pr.call();
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('headers');
    expect(pr.headers).to.be.instanceOf(HttpHeaders);
    let headers = pr.headers.getAllHeaders();
    expect(headers).to.have.property('authorization');
    expect(headers.authorization).to.eql(['Basic dXNlcjpwYXNz']);

    pr = new PillowRequest();
    pr.authByToken('value');
    pr.call();
    expect(pr).to.be.instanceOf(PillowRequest);
    expect(pr).to.have.property('headers');
    expect(pr.headers).to.be.instanceOf(HttpHeaders);
    headers = pr.headers.getAllHeaders();
    expect(headers).to.have.property('authorization');
    expect(headers.authorization).to.eql(['value']);
  });

  it('should use the generallCallback if provided', () => {
    let pr = new PillowRequest();
    pr.callback(() => {});
    pr.call();
  });

  it('should use the successCallback and errorCallback if provided', () => {
    let pr = new PillowRequest();
    pr.onSuccess(() => {});
    pr.onError(() => {});
    pr.call();
  });

  it('should return a Promise if no callback is provided', async () => {
    let pr = new PillowRequest();
    const promise = pr.call();
    expect(promise).to.be.instanceOf(Promise);
    const result = await promise;
    expect(result).to.be.a('object');
    expect(result).to.have.property('error');
    expect(result).to.have.property('response');
    expect(result).to.have.property('body');
  });
})