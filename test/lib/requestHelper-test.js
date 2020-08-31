const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');

const { requestHelper } = require('../../lib/requestHelper');

describe('requestHelper', () => {
  it('should successfully perform an HTTP request and handle both error and successful requests', async () => {
    // Test a request success by hitting a nocked endpoint and sending a JSON request body
    nock('http://test').post('/post').reply(200, { status: 'success' });
    let response = await requestHelper('POST', 'http://test/post', null, { key1: 'value1' }, false);
    expect(response).to.be.a('object');
    expect(response).to.have.property('error');
    expect(response.error).to.equal(null);
    expect(response).to.have.property('requestReturnObj');
    let retObj = response.requestReturnObj;
    expect(retObj).to.have.property('elapsedTime');
    expect(retObj).to.have.property('requestUrl');
    expect(retObj).to.have.property('responseBody');
    expect(retObj).to.have.property('responseError');
    expect(retObj.responseError).to.equal(null);
    expect(retObj).to.have.property('responseHeaders');
    expect(retObj).to.have.property('responseStatusCode');

    // Test a request success by hitting a nocked endpoint and sending a string request body
    nock('http://test').post('/post').reply(200, { status: 'success' });
    response = await requestHelper('POST', 'http://test/post', null, 'key1=value1', false);
    expect(response).to.be.a('object');
    expect(response).to.have.property('error');
    expect(response.error).to.equal(null);
    expect(response).to.have.property('requestReturnObj');
    retObj = response.requestReturnObj;
    expect(retObj).to.have.property('elapsedTime');
    expect(retObj).to.have.property('requestUrl');
    expect(retObj).to.have.property('responseBody');
    expect(retObj).to.have.property('responseError');
    expect(retObj.responseError).to.equal(null);
    expect(retObj).to.have.property('responseHeaders');
    expect(retObj).to.have.property('responseStatusCode');

    // Test a request error by hitting an endpoint without a nock interceptor
    response = await requestHelper('POST', 'http://test/post/json', null, null, false);
    expect(response).to.be.a('object');
    expect(response).to.have.property('requestReturnObj');
    retObj = response.requestReturnObj;
    expect(retObj).to.have.property('responseError');
    expect(retObj.responseError).to.be.a('string');
  });
});