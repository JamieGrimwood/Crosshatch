const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const settings = require('./settings.json')

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, '/views'));

app.use(session({
  secret: settings.auth.secret,
  resave: true,
  saveUninitialized: true
}));

app.get('*', (req, res) => {
  if (req._parsedUrl.pathname === '/') return res.render("login");

  if (!req.session.authenticated || req.session.authenticated != true) return res.redirect('/')

  console.log(req.session)

  if (req._parsedUrl.pathname === "/dashboard") return res.render("dashboard")
});

app.post('/auth/login', async (req, res) => {
  console.log(req.body.password);
  if (settings.auth.password == req.body.password) {
    req.session.authenticated = true;
    res.redirect('/dashboard')
  } else {
    res.redirect('/?err=INCORRECTPASS')
  }
});

app.listen(settings.port, () => {
  console.log(`Example app listening on port ${settings.port}`);
});