const { fetchArticlesById } = require('../models/article.model')

function getArticlesById(req, res, next){
    const { article_id } = req.params
    return fetchArticlesById(article_id).then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
}

module.exports = { getArticlesById }