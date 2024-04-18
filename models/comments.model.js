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

module.exports = { fetchCommentsByArticleId, insertCommentsByArticleId }