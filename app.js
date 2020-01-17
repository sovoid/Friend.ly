const createError = require("http-errors");
const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const proxy = require("express-http-proxy");
const passport = require("passport");
const User = require("./utils/models/user");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const accountRouter = require("./routes/auth");
const meRouter = require("./routes/settings");
const extraRouter = require("./routes/extras/wordbeater/main");
const categoryRouter = require("./routes/category");
const restApi = require("./routes/api/v1/index");
const publicApiRouter = require("./routes/developer/api");
const chatRouter = require("./routes/chat");

const app = express();

require("dotenv").config();

app.conf = require("./config/app");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

require("./utils/handlers/github");

const cooky = {
  secret: "work hard",
  resave: true,
  expires: new Date() * 60 * 60 * 24 * 7,
  saveUninitialized: true,
  store: new MongoStore({ url: app.conf.db.connectionUri })
};

app.sessionMiddleware = session(cooky);
if (process.env.NODE_ENV == "production") {
  //Production middlewares
  console.log("Production mode on");
  const compression = require("compression");
  const minify = require("express-minify");
  app.use(compression());
  app.use(
    minify({
      cache: __dirname + "/public/cache",
      uglifyJS: true
    })
  );
  app.use(function(req, res, next) {
    res.setHeader("Cache-Control", "public, max-age=86400");
    next();
  });
}
app.set("trust proxy", 1); // trust first proxy
app.use(app.sessionMiddleware);
app.use(logger("tiny"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
var date = new Date();
app.events = [
  {
    title: "OpenFuel",
    text: "Launching soon...",
    img: "/images/station.png",
    time: [date, date.setDate(date.getDate() + 1)],
    link: {
      link_url: "https://openfuel.org",
      link_text: "Visit"
    }
  }
];
app.use(
  express.static(
    path.join(__dirname, "public"),
    process.env.NODE_ENV == "production"
      ? {
          maxAge: 31557600
        }
      : {}
  )
);

if (process.env.OFFLINE) {
  /** Only For Offline Tests **/
  app.use((req, res, next) => {
    if (req.url == "/") req.session.user = app.conf.offline;
    next();
  });
}
app.use((req, res, next) => {
  res.locals.user = req.session.user ? req.session.user : false;
  res.locals.where = req.url;
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  if (!req.query.delete_notif || !req.session.user) return next();
  next = function() {
    console.log(req.originalUrl);
    return res.redirect(
      req.originalUrl.split("delete_notif=" + req.query.delete_notif).join("")
    );
  };
  User.findOne({ id: req.session.user.id }, function(err, user) {
    if (!user || err) return next();
    let notif = user.notifications.find(x => x.id == req.query.delete_notif);
    if (!notif) return next();
    user.notifications.splice(user.notifications.indexOf(notif), 1);
    user.save(function() {
      next();
    });
  });
});
app.use("/", indexRouter);
app.use("/account", accountRouter);
app.use(function(req, res, next) {
  if (req.session.user) return next();
  res.redirect("/");
});
app.use("/u", usersRouter);
app.use("/me", meRouter);
app.use("/api", restApi);
app.use("/category", categoryRouter);
app.use("/products", extraRouter);
app.use("/chat", chatRouter);
app.use("/developer", publicApiRouter);
app.use("/console", proxy("http://localhost:5000"));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

setTimeout(() => {
  if (process.argv.find(x => x == "--test")) {
    return process.exit(0);
  }
}, 2000);

module.exports = app;
