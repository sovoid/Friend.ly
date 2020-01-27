const TwitterStrategy = require("passport-twitter").Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const passport = require("passport");
const User = require("../models/user");
const getUserTimeLine = require("./bot.js");
const Twit = require("Twit");
const guid = require("guid");
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
    function (token, tokenSecret, profile, cb) {
      const TwitterClient = new Twit({
        consumer_key:         process.env.TWITTER_CONSUMER_KEY || " ",
        consumer_secret:      process.env.TWITTER_CONSUMER_SECRET || " ",
        access_token:         token,
        access_token_secret:  tokenSecret
      });
      User.findOne({ username: profile.username, loginType: "twitter" }).exec((err, dbUser) => {
        if (dbUser) {
          return cb(null, dbUser);
        } else {
          console.log("New user!");
          console.log(JSON.stringify(profile));
          getUserTimeLine(TwitterClient, profile["username"], createUser);
          function createUser(err, resp) {
            // Error handling for less than 100 word count would go here!
            if (err) {
              console.log("Error fetching big five values!");
              return cb(null, dbUser);
            }
            var newUser = User({
              username: profile["username"],
              token: token,
              token_secret: tokenSecret,
              id: guid.raw(),
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
              notifications: [],
              email: profile.email,
              bigFive: {
                o: resp.openess,
                c: resp.conscientiousness,
                e: resp.extraversion,
                a: resp.agreeableness,
                n: resp.neuroticism
              },
              loginType: "twitter"
            });
            console.log(newUser);
            newUser.save((err, done) => {
              if (err) return cb(err, null);
              if (done) return cb(null, done);
            });
           }
          
        }
      });
    }
  )
);

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ email: profile.emails[0].value, loginType: "google" }).exec(function (err, dbUser) {
        if (dbUser) {
          dbUser.exists = true;
          return cb(null, dbUser);
        } else {
          console.log("New user!");
          console.log(JSON.stringify(profile));
          var email = profile.emails[0].value;
          var username = email.substr(0, email.lastIndexOf("@"));
          var newUser = {
            username: username,
            email: email,
            token: accessToken,
            token_secret: refreshToken,
            id: guid.raw(),
            posts: [],
            profile_url: "mailto:" + email,
            profile_picture: profile.photos[0].value,
            name: profile.displayName,
            location: profile.location,
            bio: "Hey there! I am using Friend.ly",
            created_at: Date.now(),
            followers: 0,
            friendlyFollowers: [],
            following: 0,
            notifications: [],
            loginType: "google",
            firstname: profile.name.givenName,
            lastname: profile.name.familyName
          };
          // newUser.save(function (err, done) {
          //   if (err) return cb(err);
          //   if (done) return cb(null, done); 
          // })
          return cb(null, newUser)
      } 
    })
  })
)

