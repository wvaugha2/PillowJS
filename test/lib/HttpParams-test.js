const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');

const { HttpParams } = require('../../lib/HttpParams');

describe('HttpParams constructor', () => {
  it('should initialize a params class object with all provided values if a valid input is provided', () => {
    const result = new HttpParams({ p1: 'v1', p2: ['v2', 'v3']});
    expect(result).to.be.instanceOf(HttpParams);
    const params = result.getAllParams();
    expect(params).to.have.property('p1');
    expect(params.p1).to.eql(['v1']);
    expect(params).to.have.property('p2');
    expect(params.p2).to.eql(['v2','v3']);
  });

  it('should initialize an empty params class if an invalid input is provided', () => {
    const result = new HttpParams();
    expect(result).to.be.instanceOf(HttpParams);
    const params = result.getAllParams();
    expect(Object.keys(params).length).to.equal(0);
  });

  it('should initialize params via a query parameter string', () => {
    const result = new HttpParams('?p1=v1&p2=v2&p2=v3');
    expect(result).to.be.instanceOf(HttpParams);
    const params = result.getAllParams();
    expect(params).to.have.property('p1');
    expect(params.p1).to.eql(['v1']);
    expect(params).to.have.property('p2');
    expect(params.p2).to.eql(['v2','v3']);
  });
});

describe('HttpParams.addParam', () => {
  it('should add the provided param and value', () => {
    const result = new HttpParams();
    result.addParam('p1', 'v1');
    const params = result.getAllParams();
    expect(params).to.have.property('p1');
    expect(params.p1).to.eql(['v1']);
  });
});

describe('HttpParams.removeParam', () => {
  it('should, for the provided param, remove the specified value or all values if one wasn\'t specified', () => {
    const result = new HttpParams({ p1: ['v1', 'v4'], p2: ['v2', 'v3']});
    result.removeParam('p1');
    result.removeParam('p2', 'v3');
    const params = result.getAllParams();
    expect(params).to.not.have.property('p1');
    expect(params).to.have.property('p2');
    expect(params.p2).to.eql(['v2']);
  });
});

describe('HttpParams.getParam', () => {
  it('should return the array of values for the provided param if it exists, otherwise null', () => {
    const result = new HttpParams({ p1: ['v1', 'v4'], p2: ['v2', 'v3']});
    let param = result.getParam('p1');
    expect(param).to.eql(['v1', 'v4']);
    param = result.getParam('p5');
    expect(param).to.equal(null);
  });
});

describe('HttpParams.getAllParams', () => {
  it('should return all query parameter values as a query parameter string', () => {
    const result = new HttpParams({ p1: ['v1', 'v4'], p2: ['v2', 'v3']});
    const params = result.getAllParams(true);
    expect(params).to.be.a('string');
    expect(params).to.equal('?p1=v1&p1=v4&p2=v2&p2=v3');
  });

  it('should return an object with all values for each query parameter within an array', () => {
    const result = new HttpParams({ p1: ['v1', 'v4'], p2: ['v2', 'v3']});
    const params = result.getAllParams();
    expect(params).to.have.property('p1');
    expect(params.p1).to.eql(['v1', 'v4']);
    expect(params).to.have.property('p2');
    expect(params.p2).to.eql(['v2','v3']);
  });
});

describe('HttpParams.clearParams', () => {
  it('should clear all params, resetting the HttpParams class', () => {
    const result = new HttpParams({ p1: ['v1', 'v4'], h2: ['v2', 'v3']});
    result.clearParams();
    const params = result.getAllParams();
    expect(params).to.eql({});
  });
});