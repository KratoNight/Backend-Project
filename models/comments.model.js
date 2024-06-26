const db = require('../db/connection')

function fetchCommentsByArticleId(article_id){
    return db.query
    (`SELECT * FROM comments
    WHERE article_id = $1        
    ORDER BY created_at DESC
    ;`, [article_id])
    .then(({ rows }) => {
        return rows
    })
}

function insertCommentsByArticleId(body, username, article_id){
    return db.query(`
    INSERT INTO comments
    (article_id, author, body)
    VALUES ($1, $2, $3)
    RETURNING *;`,
    [body, username, article_id])
    .then(({ rows }) => {
        return rows[0]
    })
}

function removeCommentByCommentId(comment_id){
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`,
    [comment_id])
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'Comment does not exist!'})
        }
    })
}

module.exports = { fetchCommentsByArticleId, insertCommentsByArticleId, removeCommentByCommentId }