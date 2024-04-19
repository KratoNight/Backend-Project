const db = require('../db/connection');

function fetchTopics() {
    return db.query("SELECT * FROM topics;").then(({ rows }) => {
        return rows
    })
}

function fetchTopicIfItExists(topic){
    if(topic){
        return db.query(`
        SELECT * FROM TOPICS
        WHERE slug= $1;`,
        [topic])
        .then(({ rows }) => {
            if(rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Topic not found!'})
            }
        })
    }
}

module.exports = { fetchTopics, fetchTopicIfItExists }