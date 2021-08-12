const express = require('express');
const app = express();
const port = 8080;
var path = require('path');
const secret = 'cheesesteak';
const jwt = require('jsonwebtoken');
const passport = require('passport');
var morgan = require('morgan');
require('./config/database');
require('dotenv').config();
require('./models/user');
require('./config/passport')(passport);
const routes = require('./routes/users.js');

// This will initialize the passport object on every request

//express json body parser built in
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// morgan will return in consoal any route that is hit check out the documentation for more options.
app.use(morgan('tiny'));
app.use(passport.initialize());
// serving the static files from the react auth app
app.use('/', express.static(path.join(__dirname, '../main/public')));

app.use(routes);

// ******example of how jwt works on its own *****
//look at jasonwebtokens npm documentation for options.

const payloadObj = {
  sub: '1234567890',
  name: 'John Doe',
  admin: true,
};
// gnerates the token needs a payload object, secret or pemkey, options.
const signedJWT = jwt.sign(payloadObj, secret, { expiresIn: '5s' });
// our JWT
console.log(signedJWT);
// Verifying that the token is valid.
jwt.verify(signedJWT, secret, (err, decoded) => {
  if (err) {
    console.log(err, 'we had an error');
  } else {
    console.log(decoded, 'decoded token');
  }
});

// function to check the token every second for if its valid.
function myStopFunction() {
  clearInterval(myInterval);
}

let myInterval = setInterval(() => {
  jwt.verify(signedJWT, secret, (err, decoded) => {
    if (err) {
      console.log(err.name, 'we had an error');
      myStopFunction();
    } else {
      console.log(decoded);
    }
  });
}, 1000);

//*** end of example of of jwt works on own. */

app.listen(process.env.PORT || 8080, () => {
  console.log(
    `Example app listening at http://localhost:${process.env.PORT || 8080}`
  );
});
