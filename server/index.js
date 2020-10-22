const express = require('express');
const app = express();
const chalk = require('chalk');
const PORT = process.env.PORT || 3000;
const api = require('./api');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  app.use(require('morgan')('dev'));
  require('dotenv').config();
}
app.use(express.json());
app.use('/api', api);

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(
  express.static(path.join(__dirname, '..', 'node_modules', 'tablesaw', 'dist'))
);

app.use('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.log(chalk.white.bgRed('Server Error', err.stack));
  if (err.status === 500) {
    return res.send(err);
  }
  res.status(404).send(err);
});

app.listen(PORT, () => {
  console.log(chalk.blue(`Listenin on port ${PORT}`));
});
