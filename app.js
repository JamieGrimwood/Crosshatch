const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const { textSync } = require('figlet');
const chalk = require('chalk');
const axios = require('axios').default;
const settings = require('./settings.json');
const expressWs = require('express-ws');
expressWs(app)

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, '/views'));

app.use(session({
  secret: settings.auth.secret,
  resave: true,
  saveUninitialized: true
}));

const year = new Date().getFullYear();

axios.get('https://api.github.com/repos/JamieGrimwood/Crosshatch/releases/latest').then(function (response) {
  if (response.data.tag_name === "0.0.1") {
    console.log(chalk.cyanBright(textSync('Crosshatch', { horizontalLayout: 'fitted' })));
    console.log(`${chalk.yellow.bold('#=============================')}${chalk.grey.bold('[')} ${chalk.cyanBright.bold('Crosshatch')} ${chalk.grey.bold(']')}${chalk.yellow.bold('=============================#')}`)
    console.log(`${chalk.yellow.bold('#')}                          ${chalk.magenta.bold('Created by: Jamie09__')}                         ${chalk.yellow.bold('#')}`);
    console.log(`${chalk.yellow.bold('#')}                   ${chalk.green(`You are running an up to date version!`)}               ${chalk.yellow.bold('#')}`);
    console.log(`${chalk.yellow.bold('#')}                          ${chalk.grey.bold(`Running on port ${settings.port}`)}                          ${chalk.yellow.bold('#')}`);
    console.log(chalk.yellow.bold('#========================================================================#'));
  } else {
    console.log(chalk.cyanBright(textSync('Crosshatch', { horizontalLayout: 'fitted' })));
    console.log(`${chalk.yellow.bold('#=============================')}${chalk.grey.bold('[')} ${chalk.cyanBright.bold('Crosshatch')} ${chalk.grey.bold(']')}${chalk.yellow.bold('=============================#')}`)
    console.log(`${chalk.yellow.bold('#')}                          ${chalk.magenta.bold('Created by: Jamie09__')}                         ${chalk.yellow.bold('#')}`);
    console.log(`${chalk.yellow.bold('#')}          ${chalk.red(`You are running an out of date version of crosshatch!`)}         ${chalk.yellow.bold('#')}`);
    console.log(`${chalk.yellow.bold('#')}                     ${chalk.red(`Please update at the link below:`)}                   ${chalk.yellow.bold('#')}`);
    console.log(`${chalk.yellow.bold('#')}          ${chalk.red(`https://github.com/JamieGrimwood/Crosshatch/releases/`)}         ${chalk.yellow.bold('#')}`);
    console.log(`${chalk.yellow.bold('#')}                          ${chalk.grey.bold(`Running on port ${settings.port}`)}                          ${chalk.yellow.bold('#')}`);
    console.log(chalk.yellow.bold('#========================================================================#'));
  }
})

app.use(require("./router/api"));
app.use(require("./router/index"));
app.use(require("./router/authenticated"));

app.listen(settings.port, () => {
  console.log(`Crosshatch listening on port ${settings.port}`);
});