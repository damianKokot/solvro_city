var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var algorithm = require('./Algorithm');

var app = express();

app.get("/stops", (req, res) => {
    var stops = algorithm.getData().nodes.map((stop) => {
        var proceedStop = {};
        proceedStop.name = stop.stop_name;
        return proceedStop;
    });

    res.json(stops);
});
app.get("/path", (req, res) => {
    algorithm.GetResponse(req.query.source);
});

var port = process.env.PORT || 3000;
app.listen(process.env.PORT, () => {
    //Starting server
    console.log('Server has started on port ' + port);

    //Downloading data 
    var jsonUrl = 'https://raw.githubusercontent.com/Solvro/rekrutacja/master/backend/solvro_city.json';
    request(jsonUrl, { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err)
        };
        algorithm.setData(body);
    });

});
