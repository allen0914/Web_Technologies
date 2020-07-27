const express = require('express');
const router = express.Router();
const request = require('request');
const url = require("url");

const googleTrends = require('google-trends-api');

function filterTrendResult(data, name) {

    data = data['default']['timelineData'];

    let dataArr = [];

    for (let i = 0; i < data.length; i++) {
        dataArr.push(data[i]['value'][0])
    }

    return {
        "keyword": name,
        "dataArr": dataArr
    }

}

router.get('/:content', function (req, res) {
    let keyWord = req.params.content;
    googleTrends.interestOverTime({keyword: keyWord, startTime: new Date('2019-06-01')})
        .then(function(results){
            res.send(filterTrendResult(JSON.parse(results), keyWord));
        })
        .catch(function(err){
            console.error('Oh no there was an error', err);
        });
});

module.exports = router;

