const express = require('express')
const { getTopics } = require('./controllers/topics.controller')

const app = express()

app.get('/api/topics', getTopics)

app.use((request, response, next) => {
    response.status(404).send({ msg: 'Not Found!'})
})

module.exports = app