const crypto = require('crypto');
const randomize = require('randomatic');

// const resMessages = require('./res-messages');

const iterationsPbkdf2 = 100;
const passwordHashSchema = 'pbkdf2';
const saltLength = 32;
const derivedKeyLength = 32;
const digestSchema = 'sha256';

const hashPassword = function (password) {
  if (passwordHashSchema === 'pbkdf2') {
    let salt = randomize('a0', saltLength);
    return {
      derivedKey: crypto.pbkdf2Sync(password, salt, iterationsPbkdf2, derivedKeyLength, digestSchema).toString('hex'),
      iterations: iterationsPbkdf2,
      passwordHashSchema: passwordHashSchema,
      salt: salt
    };
  } else {
    return null;
  }
};

const verifyPassword = function (password, hash) {
  if (hash.passwordHashSchema === 'pbkdf2') {
    let hashedPassword = crypto.pbkdf2Sync(password,
      hash.salt, hash.iterations, hash.derivedKey.length / 2, digestSchema).toString('hex');
    if (hash.derivedKey === hashedPassword) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

const authorize = function (req, res, next) {
  if (req.session.email && req.session.userId) {
    next();
  } else {
    res.status(401).send({
      error: 'Unauthorized',
      message: 'You are not authorized, please log in.'
    });
  }
};

module.exports = {
  authorize,
  hashPassword,
  verifyPassword
};