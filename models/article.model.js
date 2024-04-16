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

module.exports = { fetchArticlesById }