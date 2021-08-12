const mongoose = require('mongoose');
// mongoose model for the database user entry.
const UserSchema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
});

mongoose.model('User', UserSchema);
