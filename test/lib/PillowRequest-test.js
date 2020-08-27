const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;

const PillowRequest = require('../../lib/PillowRequest');

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