const { fetchArticleIfExists } = require('../models/article.model')
const { fetchCommentsByArticleId } = require('../models/comments.model')

function getCommentsByArticleId(req, res, next){
    const { article_id } = req.params
    return Promise.all([fetchCommentsByArticleId(article_id), fetchArticleIfExists(article_id)])
    .then(([ comments ]) => {
        res.status(200).send({ comments })
    }) 
    .catch(next)
}


module.exports = { getCommentsByArticleId }