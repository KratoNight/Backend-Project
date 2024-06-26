const request = require('supertest')
const db = require('../db/connection')
const app = require('../app')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')
const endpoints = require('../endpoints.json')

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('/api/topics', () => {
    test('GET 200: Responds with the an array of objects, with each slug and a description property', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            const { topics } = body
            expect(topics.length).toBe(3)
            topics.forEach((topic) => {
                expect(typeof topic.slug).toBe('string')
                expect(typeof topic.description).toBe('string')
            })
        })
    })
})

describe("/api/users", () => {
    test("GET:200 should return an array of all users and the associated avatar-url", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
          });
        });
    });
})

describe('/api/some-random-api', () => {
    test('GET 404: Responds with 404 when a unknown endpoint is called', () => {
        return request(app)
        .get('/api/some-random-api')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Not Found!')
        })
    })
})

describe('/api', () => {
    test('GET 200: Responds with an object describing all the available endpoints on the API', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            expect(body).toEqual(endpoints)
        })
    })
})

describe('/api/articles', () => {
    test('GET 200: Responds with an articles array of articles objects which match and sorted by order descending', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toHaveLength(13);
          expect(body.articles).toBeSortedBy('created_at', {
            descending: true,
          });
          body.articles.forEach((article) => {
            expect(typeof article.author).toBe('string');
            expect(typeof article.title).toBe('string');
            expect(typeof article.article_id).toBe('number');
            expect(typeof article.topic).toBe('string');
            expect(typeof article.created_at).toBe('string');
            expect(typeof article.votes).toBe('number');
            expect(typeof article.article_img_url).toBe('string');
            expect(typeof article.comment_count).toBe('number');
            expect(article.body).toBeUndefined();
          });
        });
    });
    test('GET 200: Responds with an array of articles filtered to only include the topic of cats!!!', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(1)
            articles.forEach((article) => {
                expect(article.topic).toBe('cats')
            });
        });
    });
    test('GET 200: Responds with an array of all articles, filtered by the topic of mitch, As mitch is a popular topic', () => {
        return request(app)
          .get('/api/articles?topic=mitch')
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
            articles.forEach((article) => {
                expect(article.topic).toBe('mitch');
            });
          });
      });
      test('GET 200: Responds with an empty array for an existing topic with no associated articles, this is testing the paper topic', () => {
        return request(app)
          .get('/api/articles?topic=paper')
          .expect(200)
          .then(({ body: { articles } }) => {
                expect(articles).toHaveLength(0);
          });
      });
      test('GET 404: Responds with a not found 404 error if the topic does not exist in db', () => {
        return request(app)
        .get('/api/articles?topic=someSillyLittleTopic')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Topic not found!')
        });
    });
})

describe('/api/articles/:article_id', () => {
    test('GET 200: Responds with article object with the requested id and all of the properties associated with this', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            const { article } = body
            const { author,  title, article_id, topic, created_at, votes, article_img_url } = article
            expect(article_id).toBe(1)
            expect(title).toBe('Living in the shadow of a great man')
            expect(author).toBe('butter_bridge')
            expect(topic).toBe('mitch')
            expect(article.body).toBe('I find this existence challenging')
            expect(created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(votes).toBe(100)
            expect(article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        });
    });
    test('GET 404: Responds with a 404/not found if article_id is valid but it doesn\'t exist in database', () => {
        return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article not found!');
        });
    })
    test('GET 400: Responds with a bad request error if article_id is not valid', () => {
        return request(app)
        .get('/api/articles/not-a-number')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request!');
          });
      });
    test("GET 200: Response article has a comment count of the total number of comments by article_id", () => {
        return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
            expect(body.article.comment_count).toBe(11);
            expect(body.article.article_id).toBe(1);
          });
      });
      test('PATCH 200: Responds with correctly updated votes in article object', () => {
        const addingNewVotes = { inc_votes : 1 } 
        return request(app)
        .patch('/api/articles/1')
        .send(addingNewVotes)
        .expect(200)
        .then(({ body: { article }}) => {
            const { author,  title, article_id, topic, created_at, votes, article_img_url } = article
            expect(votes).toBe(101)
            expect(article_id).toBe(1)
            expect(title).toBe('Living in the shadow of a great man')
            expect(author).toBe('butter_bridge')
            expect(topic).toBe('mitch')
            expect(article.body).toBe('I find this existence challenging')
            expect(created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        })
    })
    test('PATCH 200: Responds with correctly updated votes in article object but subtracting votes ', () => {
        const takingAwayVotes = { inc_votes : -10 } 
        return request(app)
        .patch('/api/articles/1')
        .send(takingAwayVotes)
        .expect(200)
        .then(({ body: { article }}) => {
            const { author,  title, article_id, topic, created_at, votes, article_img_url } = article
            expect(votes).toBe(90)
            expect(article_id).toBe(1)
            expect(title).toBe('Living in the shadow of a great man')
            expect(author).toBe('butter_bridge')
            expect(topic).toBe('mitch')
            expect(article.body).toBe('I find this existence challenging')
            expect(created_at).toBe('2020-07-09T20:11:00.000Z')
            expect(article_img_url).toBe('https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700')
        })
    })
    test('PATCH 400: Responds with a bad request if inv_votes value is a string', () => {
        const testVotes = { inc_votes : 'some string'}
        return request(app)
        .patch('/api/articles/1')
        .send(testVotes)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request!')
        })
    })
    test('PATCH 400: Responds with a bad request if inv_votes key is not passed but a vote is', () => {
        const testVotes = { unknown_key : 1}
        return request(app)
        .patch('/api/articles/1')
        .send(testVotes)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad request!')
        })
    })
    test('PATCH 404: Responds with a not found error, if the article_id is valid, but doesn\'t exist within the db', () => {
        const testVotes = { inc_votes : 1}
        return request(app)
        .patch('/api/articles/743')
        .send(testVotes)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article not found!')
        })
    })
})

describe('/api/articles/:article_id/comments', () => {
    test('GET 200: Responds with array of comments for the given article_id with all correct properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
            expect(comments.length).toBe(11)
            comments.forEach((comment => {
                const {comment_id, votes, created_at, author, body, article_id} = comment
                expect(typeof comment_id).toBe('number')
                expect(typeof votes).toBe('number')
                expect(typeof created_at).toBe('string')
                expect(typeof author).toBe('string')
                expect(typeof body).toBe('string')
                expect(typeof article_id).toBe('number')
            }))
        })
    })
    test('Get 200: Responds with a comments array that is ordered by the dates comment when it was created, this descending by default', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
            expect(comments).toBeSortedBy('created_at', { descending: true })
        })
    })
    test('GET 404: Responds with a not found error if article_id is valid but this doesn\'t exist in the database', () => {
        return request(app)
        .get('/api/articles/42/comments')
        .expect(404)
        .then(({ body: { msg } }) => {
            expect(msg).toBe('Article not found!')
        });
    })
    test('GET 400: Responds with a bad request error if article_id is not valid', () => {
        return request(app)
            .get('/api/articles/not-a-number/comments')
            .expect(400)
            .then(({ body: { msg } }) => {
            expect(msg).toBe('Bad request!')
        })
    })
})

describe('/api/articles/:article_id/comments', () => {
    test('POST 201: Responds with a comment object that has been inserted into the comments table and contains the relevent information', () => {
        const fakeCommentForTesting = { username: 'lurker', body: 'Just a random comment for testing purposes!'}
        return request(app)
        .post('/api/articles/1/comments')
        .send(fakeCommentForTesting)
        .expect(201)
        .then(({ body : { comment } }) => {
            const { comment_id, author, body, article_id, votes, created_at }  = comment
            expect(comment_id).toBe(19)
            expect(article_id).toBe(1)
            expect(author).toBe('lurker')
            expect(body).toBe('Just a random comment for testing purposes!')
            expect(votes).toBe(0)
            expect(typeof created_at).toBe('string')        
        })
    })
    test('POST 404: Responds with a 404 Not Found! error when the request body is sent a unknown/not known username which doesn\'t exist in the db', () => {
        const fakeCommentForTesting = {username: 'meowmeowingway', body: 'Just a random comment for testing purposes!'}
        return request(app)
        .post('/api/articles/1/comments')
        .send(fakeCommentForTesting)
        .expect(404)
        .then(({ body }) => {
        expect(body.msg).toBe('Not found!')
        })
    })
    test('POST 404: Responds with a not found error if article_id is valid but does not exist in db', () => {
        const fakeCommentForTesting = { username: 'lurker', body: 'Just a random comment for testing purposes!'}
        return request(app)
        .post('/api/articles/222/comments')
        .send(fakeCommentForTesting)
        .expect(404)
        .then(({ body }) => {
        expect(body.msg).toBe('Not found!')
        })
    })
    test('POST 400: Responds with a bad request if the username is valid but the object key that is being passed in does not match!', () => {
        const fakeCommentForTesting = { username: 'lurker', someRandomBody : 'Just a random comment for testing purposes!'}
        return request(app)
        .post('/api/articles/1/comments')
        .send(fakeCommentForTesting)
        .expect(400)
        .then(({ body }) => {
        expect(body.msg).toBe('Bad request!')
        })
    })
    test('Post 400: Responds with bad request if just passed the body', () => {
        const fakeCommentForTesting = { body: 'Just a random comment for testing purposes!'}
        return request(app)
          .post("/api/articles/1/comments")
          .send(fakeCommentForTesting)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request!');
          });
      });
      test('Post 400: Responds with bad request if just passed the username with no comment assigned to it!', () => {
        const fakeCommentForTesting = { username: 'lurker'}
        return request(app)
          .post("/api/articles/1/comments")
          .send(fakeCommentForTesting)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request!');
          });
      });
})

describe('/api/comments/:comment_id', () => {
    test('DELETE 204: Deletes the specified comment and sends no body back', () => {
        return request(app)
        .delete('/api/comments/3')
        .expect(204)
    })
    test('DELETE 400: Responds with a bad request error if the comment_id is invalid', () => {
        return request(app)
        .delete('/api/comments/randomstring')
        .expect(400)
        .then(({ body }) => {
        expect(body.msg).toBe('Bad request!')
        })
    })
    test('DELETE 404: Responds with a not found error if the comment_id is valid but not found in db', () => {
        return request(app)
        .delete('/api/comments/285')
        .expect(404)
        .then(({ body }) => {
        expect(body.msg).toBe('Comment does not exist!')
        })
    })
})