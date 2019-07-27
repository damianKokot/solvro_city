var algorithm = require('./Algorithm');

//Wartości pobrane z JSON
var data = algorithm.getData();
var graph = algorithm.getGraph();

function getRoute(sourceId, targetId) {

    var distanceFromSource = algorithm.prepareTable();
    var visited = (new Array(data.nodes.length)).fill(-1);

    var time = 0;
    function findPath(node) {
        visited[node] = time;
        
        for (let i = 0; i < graph[node].length; ++i) {
            var link = graph[node][i];
            var newDistance = distanceFromSource[node].dist + link.distance;

            if (visited[link.to] != time && distanceFromSource[link.to].dist > newDistance) {
                distanceFromSource[link.to].dist = newDistance;
                distanceFromSource[link.to].last = node;
                findPath(link.to);
            }
            time++;
        }
        return;
    }
    findPath(sourceId);

    var response = {
        stops: [],
        distance: distanceFromSource[targetId].dist
    };


    var nodeId = targetId;
    var stops = [
        {
            name: targetId
        }
    ];
    while (nodeId !== sourceId) {
        if (nodeId === -1) {
            return {};
        }

        nodeId = distanceFromSource[nodeId].last;
        stops.unshift({
            name: nodeId
        });
    }

    response.stops = stops;
    return response;
}

function twoRandomNumbers() {
    var first = Math.floor(Math.random() * data.nodes.length);
    var second = first;
    while (second === first) {
        second = Math.floor(Math.random() * data.nodes.length);
    }
    return {
        first: first,
        second: second
    }
}
function doTest() {
    var errors = [];

    console.log("Im testing.....");
    for (let i = 0; i < 10000; ++i) {
        console.log("test " + (i + 1));
        var numbers = twoRandomNumbers();

        var res1 = algorithm.GetResponse(data.nodes[numbers.first].stop_name, data.nodes[numbers.second].stop_name);
        var res2 = test.GetResponse(data.nodes[numbers.first].stop_name, data.nodes[numbers.second].stop_name);

        res1 = JSON.stringify(res1);
        res2 = JSON.stringify(res2);

        if (res1 == res2) {
            console.log("OK");
        } else {
            console.log("ERROR");


            console.log("Algorithm");
            console.log(res1);
            console.log("Test ");
            console.log(res2);
            break;
        }
    }

    errors.forEach(x => {
        console.log(x);
    });
}


function getResponse(sourceName, targetName) {
    return getRoute(getStopId(sourceName), getStopId(targetName));
}

module.exports = {
    GetResponse: getResponse,
    getData: function () {
        return data;
    },
    setData: function (Data) {
        data = Data;
        generateGraph();
    }
};