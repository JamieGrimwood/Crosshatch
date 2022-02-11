const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const settings = require('./settings.json')
const controller = require('./controller')

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, '/views'));

app.use(session({
  secret: settings.auth.secret,
  resave: true,
  saveUninitialized: true
}));

app.use(require("./router/api"));
app.use(require("./router/index"));
app.use(require("./router/authenticated"));

app.listen(settings.port, () => {
  console.log(`Crosshatch listening on port ${settings.port}`);
});