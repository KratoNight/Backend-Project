const request = require('supertest')
const db = require('../db/connection')
const app = require('../app')
const data = require('../db/data/test-data')
const seed = require('../db/seeds/seed')

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
