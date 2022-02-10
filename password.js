const crypto = require('crypto');

const hash = (pw) => {
  const salt = crypto.randomBytes(16).toString('hex');
  let hash = crypto.scryptSync(pw, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
};

const verify = (pw, hash) => {
  let [salt, key] = hash.split(':');
  let vhash = crypto.scryptSync(pw, salt, 64);
  key = Buffer.from(key, 'hex');

  return crypto.timingSafeEqual(key, vhash);
};

module.exports = { hash, verify };
