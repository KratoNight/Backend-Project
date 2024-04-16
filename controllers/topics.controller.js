const { fetchTopics } =  require('../models/topics.model')

function getTopics(request, response, next) {
    return fetchTopics().then((topics) => {
        response.status(200).send({ topics })
    })
};

module.exports = { getTopics }