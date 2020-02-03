var express = require("express");
var router = express.Router();
var user = require("../utils/handlers/user");
var array_tools = require("array-tools");
const Prism = require("prismjs");
const pearsonCorrelation = require("../utils/handlers/pearson");
var underscore = require("underscore");

router.get("/", function(req, res, next) {
  if (req.session.user) {
    user.getAll((err, users) => {
      user.findOne({ id: req.session.user.id }, (error, req_user) => {
        req.app.events.map((a, b) => {
          if (a.time[1] < new Date()) {
            req.app.events.slice(a);
          }
        });
        var suggestedUsers = [];
        var friendlyFollowers = [];
        underscore.each(users, function (user) {
          let similarityIndex = pearsonCorrelation([Object.values(req_user.bigFive), Object.values(user.bigFive)], 0, 1);
          if (similarityIndex >= 0.6 && !underscore.find(user.friendlyFollowers, (eachFollower) => eachFollower.id === req_user.id)) {
            user["similarityIndex"] = similarityIndex;
            suggestedUsers.push(user);
          }
        });
        suggestedUsers = underscore.sortBy(suggestedUsers, function iteratee(user) {
          return user.similarityIndex;
        });
        console.log(suggestedUsers);
        res.render("index", {
          user: req_user,
          title: req.app.conf.name,
          people: suggestedUsers.reverse(),
          events: req.app.events
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
