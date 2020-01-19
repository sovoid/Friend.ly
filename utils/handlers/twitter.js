const TwitterStrategy = require("passport-twitter").Strategy;
const passport = require("passport");
const User = require("../models/user");
require("dotenv").config();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  // Find or create a user
  return done(null, {});
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY || " ",
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET || " ",
      callbackURL: process.env.TWITTER_CALLBACK_URL || "http://localhost:8080/account/twitter/callback"
    },
    function(token, tokenSecret, profile, cb) {
      User.findOne({ id: profile.id }).exec((err, dbUser) => {
        if (dbUser) {
          return cb(null, dbUser);
        } else {
          console.log("New user!");
          console.log(JSON.stringify(profile));
          var newUser = User({
            username: profile["username"],
            token: token,
            token_secret: tokenSecret,
            id: profile.id,
            posts: [],
            profile_url: "https://twitter.com/" + profile["screen_name"],
            profile_picture: profile._json["profile_image_url"],
            name: profile["displayName"],
            location: profile._json["location"],
            bio: profile._json["description"],
            created_at: Date.now(),
            followers: profile._json["followers_count"],
            friendlyFollowers: [],
            following: profile._json["friends_count"],
            notifications: []
          });
          console.log(newUser);
          newUser.save((err, done) => {
            if (err) return cb(err);
            if (done) return cb(null, done);
          });
        }
      });
    }
  )
);
