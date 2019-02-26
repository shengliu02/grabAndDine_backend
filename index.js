const express = require("express");
const PORT = process.env.PORT || 5000;
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.send("Hello World");
});


app.get('*', (req, res) => {
    res.send("ERROR 404");
});

app.listen(PORT, () => {
   console.log("Listening at port " + PORT)
});

