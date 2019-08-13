const Dijkstra = require('./Dijkstra');
const database = require('./Database');

/**Gets list of stops from database */
async function getListOfStops() {
    return await database.getStops();
}


/**Gets response for request of route
 * @param {any} Nazwa przystanku startowego
 * @param {any} Nazwa przystanku końcowego
 */
async function getResponse(sourceName, targetName) {
    const sourceId = await database.getStopId(sourceName);
    const targetId = await database.getStopId(targetName);

    if (sourceId === null) {
        return {
            err: "Nie znaleziono przystanku o podanej nazwie",
            source: sourceName
        }
    }
    if (targetId === null) {
        return {
            err: "Nie znaleziono przystanku o podanej nazwie",
            target: targetName
        }
    }
    const distanceFromSource = Dijkstra(sourceId, await database.getGraph());

    if (distanceFromSource[targetId].last === -1) {
        return {
            err: "There is no connection"
        };
    } else {
        return {
            stops: await getRoute(distanceFromSource, targetId, sourceId),
            distance: distanceFromSource[targetId].dist
        };
    }
}
/**Backtrace on graph to get route
 * @param {any} table with dijkstra generated response
 */
async function getRoute(distanceFromSource, nodeId, sourceId) {
    const stops = [
        {
            name: await database.getStopName(nodeId)
        }
    ];
    while (nodeId !== sourceId) {
        nodeId = distanceFromSource[nodeId].last;
        stops.unshift({
            name: await database.getStopName(nodeId)
        });

    }

    return stops;
}

module.exports = {
    GetResponse: getResponse,
    GetListOfStops: getListOfStops
};
