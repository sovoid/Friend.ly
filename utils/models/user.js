// app/models/user.js
// load the things we need
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
// define the schema for our user model
var userSchema = mongoose.Schema({
  username: String,
  password: String,
  token: String,
  token_secret: String,
  id: String,
  posts: Array,
  profile_url: String,
  email: String,
  profile_picture: String,
  name: String,
  location: String,
  bio: String,
  created_at: String,
  followers: Number,
  friendlyFollowers: [],
  following: Number,
  notifications: Array,
  firstname: String,
  lastname: String,
  bigFive: {
    o: Number,
    c: Number,
    e: Number,
    a: Number,
    n: Number
  },
  rating: {
    count: Number,
    value: {
      type: Number,
      default: 0
    }
  },
  loginType: String
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
