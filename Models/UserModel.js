const mongose = require('mongoose');

const UserSchema = {
    login: String,
    password: String
}
const User = mongose.model('User', UserSchema);

module.exports = User;