const db = require('../db/connection')


function checkUsernameExists(username){
    return db
      .query("SELECT * FROM users WHERE username=$1", [username])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, message: 'Username Not found!' });
        }
      });
  };

function lookingForUsers(){
  return db.query(`
  SELECT * FROM users;`)
  .then(({ rows }) => rows)
}
module.exports = { checkUsernameExists, lookingForUsers }