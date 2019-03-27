const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const expressSession = require('express-session');
const passport = require('./middlewares/auth');
const controller = require('./controllers');
const models = require('./models');
const PORT = process.env.PORT || 5000;
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());
app.use(expressSession({
  secret : "GRABANDDINE - INTERNAL SECRET KEY - 666666",
  resave : false,
  saveUnitialized : true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(controller);


app.get('/', (req, res) => {
  //res.send("You are on the right site. : )");
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
  });
  
io.on('connection', function(socket){
console.log('a user connected');
socket.on('disconnect', function(){
    console.log('user disconnected');
});
});

io.emit('some event', { for: 'everyone' });

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
      io.emit('chat message', msg);
    });
  });

app.get('*', (req, res) => {
  res.send("ERROR 404");
});

models.sequelize.sync({ force: true })
  .then(() => {
    http.listen(PORT, () => {
      console.log(`Server is up and running on port: ${PORT}`)
    });
  });
