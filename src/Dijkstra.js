const Queue = require('./PriorityQueue');

/**Przygotowywuje tablicę odległości od punktu wejściowego*/
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

/** Funkcja do wyznaczania trasy pomiędzy dwoma punktami
 * @param {Id} Id przystanku startowego
 * @param {Id} Id przystanku końcowego
 */
function Dijkstra(sourceId, graph) {
    //Odległość od przystanku startowego
    const distanceFromSource = prepareDistanceFromSourceTable(sourceId, graph.length);
    //Wiadomość o tym czy dany wierzchołek został już przetworzony
    const readyNode = (new Array(graph.length)).fill(false);

    //Inicjalizacja kolejki priorytetowej      
    const queue = new Queue.priorityQueue();
    queue.distanceFromSource = distanceFromSource;
    queue.compare = function (a, b) {
        return this.distanceFromSource[a].dist < this.distanceFromSource[b].dist;
    }
    queue.push(sourceId);

    //Algorytm Dijkstry
    while (!queue.empty()) {
        const node = queue.top();
        queue.pop()
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
    return distanceFromSource;
}

module.exports = Dijkstra;
