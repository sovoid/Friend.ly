var express = require("express");
var router = express.Router();
var user = require("../utils/handlers/user");
var { getUserTone } = require("../utils/handlers/bot");
var array_tools = require("array-tools");
const Prism = require("prismjs");
const pearsonCorrelation = require("../utils/handlers/pearson");
var underscore = require("underscore");

router.get("/", function(req, res, next) {
  if (req.session.user) {
    user.getAll((err, users) => {
      user.findOne({ id: req.session.user.id }, (error, req_user) => {
        users = underscore.reject(users, (user) => user.id === req.session.user.id || underscore.has(req.session.user.chats, user.id) || pearsonCorrelation([Object.values(req_user.bigFive), Object.values(user.bigFive)], 0, 1) < 0.5 || underscore.find(user.friendlyFollowers, (eachFollower) => eachFollower.id === req_user.id));
        
        let suggestedUsers = [];
        let suggestedUsersGroup = underscore.groupBy(suggestedUsers, function iteratee(user) {
          return Math.floor(user.similarityIndex*10);
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
