const getAPI = require("../models/nc_news.models")
const data = require("../endpoints.json")
const { selectTopics } = 
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