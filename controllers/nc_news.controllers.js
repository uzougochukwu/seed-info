
const data = require("../endpoints.json")
const { selectTopics,
    selectArticleById
 } = 
require("../models/nc_news.models")

exports.displayAPI = (request, response, next) => 
{
    response.status(200).send({endpoints: data})
}

exports.getTopics = (request, response, next) => 
{
    selectTopics().then(( rows ) => {
    response.status(200).send({ rows })        
    })

}

exports.getArticleById = (request, response, next) => {

    const { article_id } = request.params
    return selectArticleById(article_id).then((article) => {
        response.status(200).send({ article })
    })

}