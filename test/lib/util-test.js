const mocha = require('mocha');
const chai = require('chai');
const expect = chai.expect;

const { isArrayOfStr, useHttpsProtocol, getCookieNameAndValue } = require('../../lib/util');

describe('isArrayOfStr', () => {
  it('should return true if an array of strings is input', () => {
    const result = isArrayOfStr(['value1', 'value2']);
    expect(result).to.be.a('boolean');
    expect(result).to.equal(true);
  });

  it('should return false if anything other than an array of strings is input', () => {
    let result = isArrayOfStr([1, 2]);
    expect(result).to.be.a('boolean');
    expect(result).to.equal(false);

    result = isArrayOfStr('value');
    expect(result).to.be.a('boolean');
    expect(result).to.equal(false);
  });
});

describe('useHttpsProtocol', () => {
  it('should return true if an url containing "https:" is provided', () => {
    const result = useHttpsProtocol('https://localhost');
    expect(result).to.be.a('boolean');
    expect(result).to.equal(true);
  });

  it('should return false if a url not containing "https:" is provided', () => {
    const result = useHttpsProtocol('http://localhost');
    expect(result).to.be.a('boolean');
    expect(result).to.equal(false);
  });

  it('should return null if an invalid input is provided', () => {
    let result = useHttpsProtocol('localhost');
    expect(result).to.equal(null);
    result = useHttpsProtocol(5);
    expect(result).to.equal(null);
  });
});

describe('getCookieNameAndValue', () => {
  it('should return an object with the name and value of the cookie', () => {
    const result = getCookieNameAndValue("cookie1=cookieValue; options");
    expect(result).to.have.property('name');
    expect(result.name).to.be.a('string');
    expect(result.name).to.equal('cookie1');
    expect(result).to.have.property('value');
    expect(result.value).to.be.a('string');
    expect(result.value).to.equal('cookieValue');
  });

  it('should return null if an invalid cookie string is provided', () => {
    const result = getCookieNameAndValue("value;//cookie1cookieValue; options");
    expect(result).to.equal(null);
  });

  it('should return null if non-string input is provided', () => {
    const result = getCookieNameAndValue(6);
    expect(result).to.equal(null);
  });
});