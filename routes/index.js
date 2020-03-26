var express = require("express");
var router = express.Router();
var db = require("../utils/handlers/user");
var { getUserTone } = require("../utils/handlers/bot");
var array_tools = require("array-tools");
const Prism = require("prismjs");
const pearsonCorrelation = require("../utils/handlers/pearson");
var underscore = require("underscore");

router.get("/", function(req, res, next) {
  if (req.session.user) {
    db.getAll((err, users) => {
      db.findOne({ id: req.session.user.id }, (error, req_user) => {
        
        // reject user if he is current user or is followed by current user or is not similar or has spoken to current user
        users = underscore.reject(users, (eachUser) => {
          return (eachUser.id === req_user.id || req_user.chats[eachUser.id] || underscore.contains(eachUser.friendlyFollowers, (eachFollower) => eachFollower.id === req_user.id) || pearsonCorrelation([underscore.values(req_user.bigFive), underscore.values(eachUser.bigFive)], 0, 1) < 0.5);
        });
        
        let suggestedUsers = [];
        let suggestedUsersGroup = underscore.groupBy(users, function iteratee(eachUser) {
          return Math.floor(eachUser.similarityIndex*10);
        });

        underscore.each(suggestedUsersGroup, (value, key) => {
          suggestedUsersGroup[key] = underscore.sortBy(value, (eachuser) => eachUser.rating.value);
          suggestedUsers = underscore.union(suggestedUsers, value);
        })

        getUserTone(req_user, function (err, mood) {
          res.render("index", {
            user: req_user,
            title: req.app.conf.name,
            people: suggestedUsers,
            events: mood
          });
         });
      });
    });
  } else {
    res.render("land", {
      title: req.app.conf.name,
      error: (req.query.error) || false
    });
  }
});

module.exports = router;
