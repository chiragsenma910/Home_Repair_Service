const express = require('express');
const http = require('http');
const session = require('express-session');
const db = require('./server/db');
const routes = require('./server/routes');
const middleware = require('./server/middleware');

const app = express();
const port = 8963;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})); 

app.use(middleware);
app.use('/', routes);

// Socket.IO logic goes here

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
