const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const expressSession = require('express-session');
const passport = require('./middlewares/auth');
const controller = require('./controllers')
const PORT = process.env.PORT || 5000;
const app = express();


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
    res.send("You are on the right site. : )");
});


app.get('*', (req, res) => {
    res.send("ERROR 404");
});


app.listen(PORT, () => {
   console.log("Listening at port " + PORT)
});

