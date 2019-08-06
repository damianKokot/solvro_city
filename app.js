﻿var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var algorithm = require('./Algorithm');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//This will be changed as soon as i`ll do database
let database = [
    {
        login: "damKoko",
        password: "password"
    }
];

//Do login
app.post("/login", (req, res) => {
    let index = database.findIndex((value) => {
        return value.login === req.body.login && value.password === req.body.password;
    });
    if (index !== -1) {
        res.send("Welcome " + database[index].login);
    } else {
        res.send("Wrong login or password");
    }
});
//Do register 
app.post("/register", (req, res) => {
    let _login = req.body.login;
    let _password = req.body.password;

    //Looking if data is undefinied
    if (!_login || !_password) {
        res.send("Something is wrong with data");
    }
    //Looking for existing user
    let index = database.findIndex((value) => {
        return value.login === _login;
    });
    if (index !== -1) {
        res.send("Login is reserved by another user");
    } else {
        database.push({
            login: _login,
            password: _password
        });
        res.send("You have registered succesfully");
    }
});

//Zwraca listę przystanków
app.get("/stops", (req, res) => {
    var stops = algorithm.getData().nodes.map((stop) => {
        var readyStop = {};
        readyStop.name = stop.stop_name;
        return readyStop;
    });

    res.json(stops);
});
//Zwraca trasę pomiędzy dwoma przystankami
app.get("/path", (req, res) => {
    res.json(algorithm.GetResponse(req.query.source, req.query.target));
});


var port = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
    //Starting server
    console.log('Server has started on port ' + port);

    //Downloading data
    const jsonUrl = 'https://raw.githubusercontent.com/Solvro/rekrutacja/master/backend/solvro_city.json';
    request(jsonUrl, { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err)
        };
        algorithm.setData(body);
    });
});