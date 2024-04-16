const express = require('express')
const { getTopics } = require('./controllers/topics.controller')
const endpoints = require('./endpoints.json')

const app = express()

app.get('/api/topics', getTopics)

app.get('/api', (request, response, next) => {
    response.status(200).send(endpoints)
})

app.use((request, response, next) => {
    response.status(404).send({ msg: 'Not Found!'})
})

module.exports = app