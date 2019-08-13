const request = require('request');
const db = require('./Database');

async function downloadData(url) {
    if (!url)
        throw { error: "Url is not correct" };
    await request(url, { json: true }, (err, res, body) => {
        if (err) {
            return console.log(err)
        };
        if (!body) {
             downloadData(url);
        } else {
            body.graph = generateGraph(body.links, body.nodes.length);
            db.saveData(body.nodes, body.graph);
        }
    });
}
/** Generate graph from list of stops */
function generateGraph(links, nodesCount) {
    const graph = new Array(nodesCount);
    for (let i = 0; i < graph.length; ++i) {
        graph[i] = new Array();
    }

    links.forEach(connection => {
        const from = connection.source;
        const extender = {
            to: connection.target,
            distance: connection.distance
        };
        graph[from].push(extender);
    });
    return graph;
}
module.exports = {
    setData: downloadData
}