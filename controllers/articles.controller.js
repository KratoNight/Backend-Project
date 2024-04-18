const { fetchArticlesById, fetchArticles, updatingVotesByArticleId, fetchArticleIfExists } = require('../models/article.model')

function getArticlesById(req, res, next){
    const { article_id } = req.params
    return fetchArticlesById(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

function getArticles(req, res, next){
    return fetchArticles().then((articles) => {
        res.status(200).send({ articles })
    })
    .catch
}

function patchVotesByArticleId(req, res, next){
    const { inc_votes } = req.body
    const { article_id } = req.params
    return Promise.all([updatingVotesByArticleId(article_id, inc_votes),  fetchArticleIfExists(article_id)])
    .then(([ article ]) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        next(err)
    })
}

module.exports = { getArticlesById, getArticles, patchVotesByArticleId }