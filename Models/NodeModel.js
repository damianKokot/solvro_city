const mongose = require('mongoose');

const NodeSchema = {
    id: Number,
    stop_name: String
}
const Node = mongose.model('Node', NodeSchema);

module.exports = Node;