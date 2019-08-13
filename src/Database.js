const mongoose = require('mongoose');

const Graph = require('../Models/GraphModel');
const Node = require('../Models/NodeModel');
const User = require('../Models/UserModel');

mongoose.connect('mongodb://localhost:27017/SolvroCityDB', { useNewUrlParser: true }, function (err) {
    if (err)
        console.log(err);
});
function saveData(nodes, graph) {

    //Firstly delete all data
    mongoose.connection.db.dropCollection("nodes", (success) => {
        if (success) {
            try {
                nodes.forEach(stop => {
                    (new Node(stop)).save();
                });
            } catch (err) {
                console.log(err);
            }
            console.log("Nodes replaced successfully");
        }
        else
            throw { err: "Deleting nodes failed" };

    });
    mongoose.connection.db.dropCollection("graphs", (success) => {
        if (success) {
            try {
                (new Graph({ list: graph })).save();
            } catch (err) {
                console.log(err);
            }
            console.log("Graph recreated successfully");
        }
        else {
            throw { err: "Deleting graph failed" };
        }
    });
}


function getStops() {
    return Node.find({})
        .then(data => {
            return data.map((stop) => {
                const readyStop = {};
                readyStop.name = stop.stop_name;
                return readyStop;
            });
        })
        .catch(err => console.log(err));
}


function getStopId(name) {
    return Node
        .findOne({ stop_name: name })
        .then(stop => stop.id)
        .catch(err => console.log(err));
}
function getStopName(stopId) {
    return Node
        .findOne({ id: stopId })
        .then(stop => stop.stop_name)
        .catch(err => console.log(err));
}
function getGraph() {
    return Graph
        .findOne({})
        .then(graph => graph.list)
        .catch(err => console.log(err));
}
function userExist(login, password) {
    return User
        .findOne({ login: login, password: password })
        .then(user => {
            if (!user) {
                throw {error: "User doesn`t exist"}
            }
        })
}
async function newUser(_login, _password) {
    //If data is wrong throw error
    if (!_login || !_password)
        throw { error: "Something is wrong with data" };

    //Test if login is currently in use
    await User.findOne({ login: _login })
        .then(user => {
            if (user) {
                throw { error: "Login is reserved by another user" }
            }
        })

    //Add user to database
    const user = new User({
        login: _login,
        password: _password
    })
    user.save();
    
}


module.exports = {
    getStopName: getStopName,
    getStopId: getStopId,
    getStops: getStops,
    getGraph: getGraph,
    saveData: saveData,
    userExist: userExist,
    newUser: newUser
}