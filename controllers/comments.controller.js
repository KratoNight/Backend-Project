const { fetchArticleIfExists } = require('../models/article.model')
const { fetchCommentsByArticleId, insertCommentsByArticleId } = require('../models/comments.model')

function getCommentsByArticleId(req, res, next){
    const { article_id } = req.params
    return Promise.all([fetchCommentsByArticleId(article_id), fetchArticleIfExists(article_id)])
    .then(([ comments ]) => {
        res.status(200).send({ comments })
    }) 
    .catch(next)
}

function postCommentsByArticleId(req,res,next){
    const { article_id } = req.params
    const { username, body } = req.body
    return Promise.all([insertCommentsByArticleId(article_id, username, body), fetchArticleIfExists(article_id)])
    .then(([ comment ]) => {
        res.status(201).send({ comment })
    })
    .catch(next)
}


module.exports = { getCommentsByArticleId, postCommentsByArticleId}