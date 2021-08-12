const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
//***From Pem files***
// const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

//** From Secret string */
const PUB_KEY = 'cheese';
const PRIV_KEY = 'cheese';
/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 *
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 *
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return hash === hashVerify;
}

/**
 *
 * @param {*} password - The password string that the user inputs to the password field in the register form
 *
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 *
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');

  return {
    salt: salt,
    hash: genHash,
  };
}

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the MongoDB user ID
 * not that the expires in is passed as a number. If passed as "5s" string it will not work.
 * sub: is the id entry for the user
 * iat: is the time the certificate was issued
 * exp: is the expiration date and will be added to the payload once the certificate is signed.
 */
function issueJWT(user) {
  console.log(user, 'my user from utility');
  const _id = user._id;
  const expiresIn = 5;
  const payload = {
    sub: _id,
    iat: Math.floor(Date.now() / 1000),
  };
  // look to documentation for options you can add to the sign method on jasonwebtoken npm site.
  // const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expireTime, algorithm: 'RS256' });
  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
  });
  return {
    token: signedToken,
    expiresIn: expiresIn,
  };
}
// extra unility function to validate token for trouble shooting
function validateToken(token) {
  console.log('validate token func');
  jsonwebtoken.verify(token, PRIV_KEY, (err, decoded) => {
    if (err) {
      ``;
      console.log(err, 'we had an error in validate token');
    } else {
      console.log(decoded, 'decoded token');
    }
  });
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.validateToken = validateToken;
