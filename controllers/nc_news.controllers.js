
const endpointsArray = require("../endpoints.json")
const { selectTopics,
    selectArticleById,
    selectArticles
 } = 
require("../models/nc_news.models")

exports.displayAPI = (request, response, next) => 
{
    response.status(200).send({endpoints: endpointsArray})
}

exports.getTopics = (request, response, next) => 
{
    selectTopics().then(( topicsData ) => {
    response.status(200).send({ topicsData })        
    })

}

exports.getArticleById = (request, response, next) => {

    const { article_id } = request.params
    return selectArticleById(article_id).then((article) => {
        response.status(200).send({ article })
    })

}

exports.getArticles = (request, response, next) => {

    selectArticles().then(( articlesData ) => {
        response.status(200).send({ articlesData })
    })

}