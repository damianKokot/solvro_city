const mongoose = require('mongoose');

const GraphSchema = {
    list: Object
};

const Graph = mongoose.model('Graph', GraphSchema);

module.exports = Graph;