/**
 * @function isArrayOfStr
 * @description This function validates if a provided value is an array of string values
 * @param {any} array - the value to be tested if it is an array of string values
 * @return {boolean} true if input is an array of strings, false otherwise
 */
const isArrayOfStr = (array) => {
  if (Array.isArray(array)) {
    for (let i = 0; i < array.length; i++) {
      if (typeof array[i] !== 'string') {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

/**
 * @function useHttpsProtocol
 * @description This function determines whether to use https based on the supplied URL
 * @param {*} url - the URL to be searched for a protocol
 * @returns {boolean} true if the URL specifies to use https, false if it doesn't, null if the url is invalid or doesn't specify a protocol
 */
const useHttpsProtocol = (url) => {
  if (typeof url === 'string') {
    const urlObj = new URL(url);
    if (urlObj && urlObj.protocol) {
      return (urlObj.protocol === 'https:') ? true : false;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

/**
 * @function getCookieNameAndValue
 * @description This function parses a standard cookie string and returns the name and value of the cookie
 * @param {string} cookie - the cookie string
 * @returns {{name: string, value: string}} the cookie's name and value packaged in an object if the cookie is valid; otherwise null if invalid or not found
 */
const getCookieNameAndValue = (cookie) => {
  if (cookie && typeof cookie === 'string') {
    const regex1 = /; */;
    const regex2 = /(.+)=(.+)/;
    const cookiePieces = cookie.split(regex1);
    // Find and return the cookie name and value
    for (let i = 0; i < cookiePieces.length; i++) {
      if (regex2.test(cookiePieces[i])) {
        const match = cookiePieces[i].match(regex2);
        if (match && Array.isArray(match) && match.length >= 3) {
          const cookieName = match[1].trim();
          const cookieValue = match[2].trim();
          return { name: cookieName, value: cookieValue };
        }
      }
    }
    return null;
  } else {
    return null;
  }
}

module.exports = { 
  isArrayOfStr,
  useHttpsProtocol,
  getCookieNameAndValue
};