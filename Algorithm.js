var Queue = require('./PriorityQueue')

//Wartości pobrane z JSON
var data;
var graph;

function getRoute(sourceId, targetId) {
    //Przygotowywuje dwie tablice, jedna z minimalnymi odległościami od środka,
    //a druga z oznaczeniem czy dany wierzchołek był już odwiedzony
    var distanceFromSource = prepareDistanceFromSourceTable(sourceId);
    var readyNode = (new Array(data.nodes.length)).fill(false);
      
    var queue = new Queue.priorityQueue();
    queue.compare = function (a, b) {
        return distanceFromSource[a].distance < distanceFromSource[b].distance;
    }
    queue.push(sourceId);
    
    while (!queue.empty()) {
        var node = queue.pop();
        readyNode[node] = true;
        
        graph[node].forEach(link => {
            let newDistance = distanceFromSource[node].dist + link.distance;
            if (distanceFromSource[link.to].dist > newDistance) {
                distanceFromSource[link.to].dist = newDistance;
                distanceFromSource[link.to].last = node;
            }
            if (!readyNode[link.to]) {
                queue.push(link.to);
            }
        });
    }

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
//Znajduje odpowiadającą nazwę przystanku i pobiera jego ID
function getStopId(name) {
    return data.nodes.filter((item) => {
        return item.stop_name == name;
    })[0].id;
}
//Generuje graf połączeń
function generateGraph() {
    graph = [];
    while (graph.length < data.nodes.length) {
        graph.push([]);
    };


    data.links.forEach(connection => {
        let from = connection.source;
        let extender = {
            to: connection.target,
            distance: connection.distance
        };
        graph[from].push(extender);

    });
}
//Przygotowywuje tablicę odległości od punktu wejściowego
function prepareDistanceFromSourceTable(sourceId) {
    let table = new Array(data.nodes.length);
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
    },
    getGraph: function () {
        return graph;
    },
    prepareTable: prepareDistanceFromSourceTable
};

