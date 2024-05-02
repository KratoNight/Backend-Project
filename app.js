const express = require('express')
const { getTopics } = require('./controllers/topics.controller')
const { getArticlesById, getArticles, patchVotesByArticleId } = require('./controllers/articles.controller')
const { getCommentsByArticleId, postCommentsByArticleId, deleteCommentsByCommentId} = require('./controllers/comments.controller')
const { getUsers } = require('./controllers/users.controller')
const endpoints = require('./endpoints.json')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors());

app.get('/api', (req, res, next) => {
    res.status(200).send(endpoints)
})
app.get('/api/topics', getTopics)
app.get('/api/users', getUsers)

app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticlesById)
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postCommentsByArticleId)

app.patch('/api/articles/:article_id/', patchVotesByArticleId)

app.delete('/api/comments/:comment_id', deleteCommentsByCommentId)


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
            res.status(400).send({ msg: 'Bad request!'})
      }
    }
    next(err)
  })
app.use((err, req, res, next) => {
    if (err.code === '23502'){
        res.status(400).send({msg: 'Bad request!'})
    }
    next(err)
})
app.use((err, req, res, next) => {
    if (err.code === '23503') {
        res.status(404).send({ msg: 'Not found!'})
    }
})
app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error!'})
})
module.exports = app