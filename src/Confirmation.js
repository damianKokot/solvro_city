//This will be changed as soon as i`ll do database
const database = require('./Database');

//Logging in
async function login(login, password) {
    return database.userExist(login, password);
}

//Registration
async function register(login, password) {
    return await database.newUser(login, password)
}

module.exports = {
    login: login,
    register: register
}