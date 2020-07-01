const path = require('path');

function verifyExtname(url, str) {
  return path.extname(url)==='.'+str
}

module.exports = {verifyExtname}