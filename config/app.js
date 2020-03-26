
var dbHost = process.env.dbHost || "localhost";
require('dotenv').config();

module.exports = {
  name: "friendly",
  title: "friendly",
  commands: {
    package:
      "electron-packager electron.js friendly --electronVersion=2.0.12 --overwrite --icon=/public/images/logo/logo.png --prune=true --out=release",
    build: ""
  },
  http: {
    host: "localhost",
    port: 80
  },
  author: "Soham Parekh <mail@sohamp.dev>",
  version: "1.0.0",
  db: {
    connectionUri:process.env.DB_CONNECTION_URI || "mongodb://" + dbHost + ":27017/friendly",
    params: {},
    collections: ["moment", "user", "feeling", "ask"]
  }
};
