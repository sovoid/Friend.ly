var express = require("express");
var router = express.Router();
var db = require("../utils/handlers/user");
var formParser = require("../utils/form-parser.js");
var passport = require("passport");
var User = require("../utils/models/user");
var validator = require("validator");
var querystring = require("querystring");

//PS: Passport stuff to be done below...
router.get("/twitter", passport.authenticate("twitter"));

router.get("/google", passport.authenticate("google", { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] }));

router.get("/new", function (req, res, next) {
  res.render("auth/signup", {
    title: req.app.conf.name,
    error: false
  })
});

router.get(
  "/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/err" }),
  function (req, res) {
    // Successful authentication, redirect home.
    req.session.user = req.session.passport.user;
    res.redirect(
      "/?logged-in=" +
      Math.random()
        .toString()
        .slice(2)
        .slice(0, 5)
    );
  }
);

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/err" }), function (req, res) {
  
  var query = querystring.stringify({
    "username": req.session.passport.user.username,
    "loginType": "google"
  });

  res.redirect("/account/quiz?" + query);
})

router.post("/new", formParser, function (req, res, next) {
  var errMsg = ""
  if (req.body.password !== req.body.password2) {
    errMsg = "Passwords don't match."
  } else if (!validator.isEmail(req.body.email)) {
    errMsg = "Invalid email."
  } else if (validator.isEmpty(req.body.firstname) || validator.isEmpty(req.body.lastname) || validator.isEmpty(req.body.username)) {
    errMsg = "Username, First Name or Last Name cannot be empty!"
  }

  if (errMsg) {
    res.render("auth/signup", {
      title: req.app.conf.name,
      error: errMsg
    });
  } else {
    db.createNew(req.body, function (error, result) {
      if (error && !result) {
        res.render("auth/signup", {
          title: req.app.conf.name,
          error: error
        });
      } else {
        var query = querystring.stringify({
          "username": result.username,
          "loginType": "friendly"
        });
        res.redirect("/account/quiz?" + query);
        // res.redirect(
        //   "/?logged-in=" +
        //   Math.random()
        //     .toString()
        //     .slice(2)
        //     .slice(0, 5)
        // );
      }
    })
  }
})

router.get("/quiz", function (req, res, next) {
  res.render("auth/quiz", {
    title: req.app.conf.name,
    username: req.query.username,
    loginType: req.query.loginType
  });
})

router.post("/quiz", formParser, function (req, res, next) {
  var o, c, e, a, n;
  function calcBigFive(start) {
    let sum = 0;
    for (let i = start; i <= 50; i = i+5) {
      sum += Number(req.body[`answerGroup${i - 1}`]);
    }
    return sum;
  }
  o = calcBigFive(5)/50;
  c = calcBigFive(3)/50;
  e = calcBigFive(1)/50;
  a = calcBigFive(2)/50;
  n = calcBigFive(4)/50;

  db.findOne({ username: req.body.username, loginType: req.body.loginType }, function (error, currentUser) {
    currentUser.bigFive.o = o;
    currentUser.bigFive.c = c;
    currentUser.bigFive.e = e;
    currentUser.bigFive.a = a;
    currentUser.bigFive.n = n;

    currentUser.save(() => {
      req.session.user = currentUser;
      res.redirect(
          "/?logged-in=" +
          Math.random()
            .toString()
            .slice(2)
            .slice(0, 5)
      );
    })
  }) 
})

router.get("/out", function(req, res, next) {
  req.session.destroy(() => {
    res.redirect("/?action=logout");
  });
});

module.exports = router;
