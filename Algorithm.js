var data;
function getStopId(name) {
    console.log(name);
    return data.nodes.filter((item) => {
        return item.stop_name == name;
    })[0].id;
}
function getResponse(sourceName, targetName) {
    console.log("source " + getStopId(sourceName));
    console.log("target " + getStopId(targetName));
}


module.exports = {
    GetResponse: getResponse,
    getData: function () {
        return data;
    },
    setData: function (Data) {
        data = Data;
    }

};

