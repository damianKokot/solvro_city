const Queue = require('./PriorityQueue')

//Wartości pobrane z JSON
let data;
let graph;

/** Funkcja do wyznaczania trasy pomiędzy dwoma punktami
 * @param {Id} Id przystanku startowego
 * @param {Id} Id przystanku końcowego
 */
function getRoute(sourceId, targetId) {
    //Odległość od przystanku startowego
    const distanceFromSource = prepareDistanceFromSourceTable(sourceId);  
    //Wiadomość o tym czy dany wierzchołek został już przetworzony
    const readyNode = (new Array(data.nodes.length)).fill(false);

    //Inicjalizacja kolejki priorytetowej      
    const queue = new Queue.priorityQueue();
    queue.compare = function (a, b) {
        return distanceFromSource[a].distance < distanceFromSource[b].distance;
    }
    queue.push(sourceId);

    //Algorytm Dijkstry
    while (!queue.empty()) {
        const node = queue.pop();
        readyNode[node] = true;
        
        graph[node].forEach(link => {
            const newDistance = distanceFromSource[node].dist + link.distance;
            if (distanceFromSource[link.to].dist > newDistance) {
                distanceFromSource[link.to].dist = newDistance;
                distanceFromSource[link.to].last = node;
            }
            if (!readyNode[link.to]) {
                queue.push(link.to);
            }
        });
    }

    //Generowanie odpowiedzi
    const response = {
        stops: [],
        distance: distanceFromSource[targetId].dist
    };

    const nodeId = targetId;
    const stops = [
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
/**Liniowo przeszukuje listę przystanków i zwraca id przystanku o podanej nazwie
 * @param {any} Nazwa przystanku
 */
function getStopId(name) {
    for (let item of data.nodes) {
        if (item.stop_name == name)
            return item.id;
    }
    return undefined;
}
/**Generuje graf z listy przystanków*/
function generateGraph() {
    graph = [];
    while (graph.length < data.nodes.length) {
        graph.push([]);
    };


    data.links.forEach(connection => {
        const from = connection.source;
        const extender = {
            to: connection.target,
            distance: connection.distance
        };
        graph[from].push(extender);

    });
}
/**rzygotowywuje tablicę odległości od punktu wejściowego*/
function prepareDistanceFromSourceTable(sourceId) {
    const table = new Array(data.nodes.length);
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

/**Przetwarza request użytkownika
 * @param {any} Nazwa przystanku startowego
 * @param {any} Nazwa przystanku końcowego
 */
function getResponse(sourceName, targetName) {
    const sourceId = getStopId(sourceName);
    const targetId = getStopId(targetName);
    if (typeof (sourceId) !== "number") {
        return {
            err: "Nie znaleziono przystanku o podanej nazwie",
            source: sourceName
        }
    }
    if (typeof (targetId) !== number) {
        return {
            err: "Nie znaleziono przystanku o podanej nazwie",
            target: targetName
        }
    }
    return getRoute(sourceId, targetId);
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
