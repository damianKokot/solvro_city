var algorithm = require('./Algorithm');
var database = require('./Database');

//Wartości pobrane z JSON
var data;
var graph;

function prepareDistanceFromSourceTable(sourceId, graphLength) {
    const table = new Array(graphLength);
    for (let i = 0; i < table.length; ++i) {
        table[i] = {
            dist: Number.MAX_SAFE_INTEGER,
            last: -1
        };
    }
    table[sourceId] = {
        dist: 0,
        last: sourceId
    };
    return table;
}

function getRoute(sourceId, targetId) {

    var distanceFromSource = prepareDistanceFromSourceTable(sourceId, data.nodes.length);
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
            return {
                err: "There is no connection"
            };
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
    data = database.getData();
    graph = database.getGraph();

    console.log("Im testing.....");
    for (let i = 0; i < 10000; ++i) {
        console.log("test " + (i + 1));
        var numbers = twoRandomNumbers();

        var res1 = algorithm.GetResponse(data.nodes[numbers.first].stop_name, data.nodes[numbers.second].stop_name);
        var res2 = getResponse(data.nodes[numbers.first].stop_name, data.nodes[numbers.second].stop_name);

        var jres1 = JSON.stringify(res1);
        var jres2 = JSON.stringify(res2);

        if (jres1 == jres2) {
            console.log("OK");
        } else if (res1.distance === res2.distance) {
            console.log("Distance OK");
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
    return getRoute(database.getStopId(sourceName), database.getStopId(targetName));
}

module.exports = {
    GetResponse: getResponse,
    getData: function () {
        return data;
    },
    setData: function (Data) {
        data = Data;
        generateGraph();
    },
    test: doTest
};
