require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const ArticlesService = require('./articles-service')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())

//This endpoint can make use of the ArticlesService we created in the previous checkpoint
app.get('/articles', (req, res, next) => {
    // use the ArticlesService.getAllArticles method inside the endpoint to populate the response.
    const knexInstance = req.app.get('db')
    ArticlesService.getAllArticles(knexInstance)
        .then(articles => {
            res.json(articles)
        })
        .catch(next)
})

app.get('/articles/:article_id', (req, res, next) => {
   const knexInstance = req.app.get('db')
   ArticlesService.getById(knexInstance, req.params.article_id)
     .then(article => {
       res.json(article)
     })
     .catch(next)
 })

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})
module.exports = app