const express = require('express');
const bodyParser = require('body-parser');
const confirmation = require('./src/Confirmation');
const algorithm = require('./src/Algorithm');
const initialise = require('./src/Initialise');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Using this route you can recreate database
app.get("/setup", (req, res) => {
    try {
        const url = req.body.url;
        initialise.setData(url)
            .then(() => res.json({
                note: "Data downloaded correctly"
            }))
            .catch(err => {
                res.json(err);
            })
    } catch (err) {
        console.log(err);
    }
});
//Do login
app.post("/login", (req, res) => {
    const _login = req.body.login;
    const _password = req.body.password;

    confirmation.login(_login, _password)
        .then(() => res.json({ note: "Congratulations! You are logged in" }))
        .catch (err => res.json(err));
});
//Do register 
app.post("/register", (req, res) => {
    const _login = req.body.login;
    const _password = req.body.password;

    confirmation.register(_login, _password)
        .then(() => res.json({ note: "Congratulations! You are registered!" }))
        .catch(err => res.json(err));
});


//Returns list of stops
app.get("/stops", (req, res) => {
    algorithm
        .GetListOfStops()
        .then(data => res.json(data));
});
//Getting path between two points
app.get("/path", (req, res) => {
    const _source = req.query.source;
    const _target = req.query.target;
    algorithm.GetResponse(_source, _target)
        .then(response => res.json(response))

});

const port = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
    //Starting server
    console.log('Server has started on port ' + port);
});