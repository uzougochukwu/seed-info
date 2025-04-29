const getAPI = require("../models/nc_news.models")
const data = require("../endpoints.json")

exports.displayAPI = (request, response, next) => 
{

    response.status(200).send({endpoints: data})


}