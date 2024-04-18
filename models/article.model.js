const db = require('../db/connection')

function fetchArticlesById(article_id) {
	return db
		.query("SELECT * from articles WHERE article_id = $1", [article_id])
		.then((article) => {
			if (article.rows.length === 0) {
				return Promise.reject({
					status: 404,
					msg: "Article not found!",
				});
			}
			return article.rows[0];
		});
}

function fetchArticles(){
		return db.query(
		  `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
		  (SELECT COUNT(*) FROM comments 
		  WHERE comments.article_id = articles.article_id)::INT AS comment_count 
		  FROM articles 
		  ORDER BY articles.created_at DESC;`
		)
		.then(({ rows }) => {
		  return rows;
		});
};

function fetchArticleIfExists(article_id){
    return db.query(`
        SELECT * FROM articles
        WHERE article_id = $1
        ;`, 
		[article_id])
    	.then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article not found!" })
        }
        return
    })
};

function updatingVotesByArticleId(article_id, inc_votes){
	return db.query(`
	UPDATE articles
	SET votes = votes + $1
	WHERE article_id = $2
	RETURNING *;`, 
	[inc_votes, article_id])
	.then(({ rows }) => {
		return rows[0]
	})
}



module.exports = { fetchArticlesById, fetchArticles, fetchArticleIfExists, updatingVotesByArticleId }