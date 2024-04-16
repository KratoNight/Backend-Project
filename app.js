const express = require('express')
const { getTopics } = require('./controllers/topics.controller')
const { getArticlesById } = require('./controllers/articles.controller')
const endpoints = require('./endpoints.json')

const app = express()

app.get('/api/topics', getTopics)

app.get('/api', (req, res, next) => {
    res.status(200).send(endpoints)
})

app.get('/api/articles/:article_id', getArticlesById)

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not Found!'})
})

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }
    next(err)
})
app.use((err, req, res, next) => {
    if(err.code) {
        if(err.code === '22P02') {
            res.status(400).send({ msg: 'Bad request'})
      }
    }
    next(err)
  })
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'})
})
module.exports = app