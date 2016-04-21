const crypto = require('crypto');

module.exports = () => {
  crypto.randomBytes(10).toString('hex');
};
