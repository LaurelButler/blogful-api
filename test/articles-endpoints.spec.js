const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeArticlesArray } = require('./articles.fixtures')



//We can create the Knex instance to connect to the test database and clear any data so that we know we have clean tables... and then disconnect from the database so that the tests don't "hang"
describe.only('Articles Endpoints', function () {

})

describe('Articles Endpoints', function () {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('blogful_articles').truncate())

    afterEach('cleanup', () => db('blogful_articles').truncate())

    context('Given there are articles in the database', () => {
        const testArticles = makeArticlesArray()
     
     beforeEach('insert articles', () => {
       return db
         .into('blogful_articles')
         .insert(testArticles)
     })

        it('GET /articles responds with 200 and all of the articles', () => {
                 return supertest(app)
                   .get('/articles')
                    .expect(200, testArticles)
              })

        it('GET /article/:article_id responds with 200 and the specified article', () => {
        const articleId = 2
        const expectedArticle = testArticles[articleId - 1]
        return supertest(app)
            .get(`/articles/${articleId}`)
            .expect(200, expectedArticle)
   })
   })
})

