// app/models/user.js
// load the things we need
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
// define the schema for our user model
var userSchema = mongoose.Schema({
  username: String,
  access_token: String,
  refresh_token: String,
  id: String,
  posts: Array,
  username: String,
  profile_url: String,
  email: String,
  languages: Array,
  profile_picture: String,
  name: String,
  website: String,
  location: String,
  hirable: Boolean,
  bio: String,
  since: String,
  created_at: String,
  repos: Array,
  user_status: String,
  new: String,
  gists: Number,
  followers: Number,
  openFollowers: [],
  following: Number,
  notifications: Array
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model("user", userSchema);

// create the model for users and expose it to our app
