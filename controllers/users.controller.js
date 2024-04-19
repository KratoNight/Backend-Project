const { lookingForUsers } = require('../models/user.model')

function getUsers(req, res, next){
    return lookingForUsers()
    .then((users) => res.status(200)
    .send({ users }))
}

module.exports = { getUsers }