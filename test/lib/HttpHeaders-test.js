const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;
const nock = require('nock');

const { HttpHeaders } = require('../../lib/HttpHeaders');

describe('HttpHeaders constructor', () => {
  it('should initialize a headers class object with all provided values if a valid input is provided', () => {
    const result = new HttpHeaders({ h1: 'v1', h2: ['v2', 'v3']});
    expect(result).to.be.instanceOf(HttpHeaders);
    const headers = result.getAllHeaders();
    expect(headers).to.have.property('h1');
    expect(headers.h1).to.eql(['v1']);
    expect(headers).to.have.property('h2');
    expect(headers.h2).to.eql(['v2','v3']);
  });

  it('should initialize an empty headers class if an invalid input is provided', () => {
    const result = new HttpHeaders();
    expect(result).to.be.instanceOf(HttpHeaders);
    const headers = result.getAllHeaders();
    expect(Object.keys(headers).length).to.equal(0);
  });
});

describe('HttpHeaders.addHeader', () => {
  it('should add the provided header and value', () => {
    const result = new HttpHeaders();
    result.addHeader('h1', 'v1');
    const headers = result.getAllHeaders();
    expect(headers).to.have.property('h1');
    expect(headers.h1).to.eql(['v1']);
  });
});

describe('HttpHeaders.removeHeader', () => {
  it('should, for the provided header, remove the specified value or all values if one wasn\'t specified', () => {
    const result = new HttpHeaders({ h1: ['v1', 'v4'], h2: ['v2', 'v3']});
    result.removeHeader('h1');
    result.removeHeader('h2', 'v3');
    const headers = result.getAllHeaders();
    expect(headers).to.not.have.property('h1');
    expect(headers).to.have.property('h2');
    expect(headers.h2).to.eql(['v2']);
  });
});

describe('HttpHeaders.getHeader', () => {
  it('should return the array of values for the provided header if it exists, otherwise null', () => {
    const result = new HttpHeaders({ h1: ['v1', 'v4'], h2: ['v2', 'v3']});
    let header = result.getHeader('h1');
    expect(header).to.eql(['v1', 'v4']);
    header = result.getHeader('h5');
    expect(header).to.equal(null);
  });
});

describe('HttpHeaders.getAllHeaders', () => {
  it('should return an object with all values for each header combined in a comma-separated string', () => {
    const result = new HttpHeaders({ h1: ['v1', 'v4'], h2: ['v2']});
    const headers = result.getAllHeaders(true);
    expect(headers).to.have.property('h1');
    expect(headers.h1).to.equal('v1,v4');
    expect(headers).to.have.property('h2');
    expect(headers.h2).to.equal('v2');
  });

  it('should return an object with all values for each header within an array', () => {
    const result = new HttpHeaders({ h1: ['v1', 'v4'], h2: ['v2', 'v3']});
    const headers = result.getAllHeaders();
    expect(headers).to.have.property('h1');
    expect(headers.h1).to.eql(['v1', 'v4']);
    expect(headers).to.have.property('h2');
    expect(headers.h2).to.eql(['v2','v3']);
  });
});

describe('HttpHeaders.checkForHeader', () => {
  it('should return the proper key if the header has been provided, otherwise the provided input value', () => {
    const result = new HttpHeaders({ h1: ['v1', 'v4'], h2: ['v2', 'v3']});
    let header = result.checkForHeader('H1');
    expect(header).to.equal('h1');
    header = result.checkForHeader('h5');
    expect(header).to.equal('h5');
    header = result.checkForHeader(5);
    expect(header).to.equal(null);
  });
});

describe('HttpHeaders.clearHeaders', () => {
  it('should clear all headers, resetting the HttpHeaders class', () => {
    const result = new HttpHeaders({ h1: ['v1', 'v4'], h2: ['v2', 'v3']});
    result.clearHeaders();
    const headers = result.getAllHeaders();
    expect(headers).to.eql({});
  });
});