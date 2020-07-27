const express = require('express');
const router = express.Router();
const request = require('request');
const url = require("url");

const guardianApiKey = '25182b92-e598-4f2d-9f3d-c1eced4df85b';

function filterTabData(data) {
    data = data['response']['results'];
    let newData = [];

    for (let i = 0; i < data.length; i++) {
        let id = '', title = '', image = '', section = '', date = '', description = '', url = '';

        let jsonObj = {
                'id' : '',
                'title': '',
                'image' : '',
                'section' : '',
                'date' : '',
                'description' : '',
                'url' : '',
            };

        if (data[i]['id'] == null) continue;
        else id = data[i]['id'];

        if (data[i]['webTitle'] == null) continue;
        else title = data[i]['webTitle'];

        let allImage = data[i]['blocks']['main']

        if (allImage == null ||
            allImage['elements'] == null ||
            allImage['elements'][0] == null ||
            allImage['elements'][0]['assets'] == null ||
            allImage['elements'][0]['assets'][allImage['elements'][0]['assets'].length - 1] == null ||
            allImage['elements'][0]['assets'][allImage['elements'][0]['assets'].length - 1]['file'] == null ||
            allImage['elements'][0]['assets'].length  === 0) {
            image = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
        }
        else {
            image = allImage['elements'][0]['assets'][allImage['elements'][0]['assets'].length - 1]['file'];
        }

        if (data[i]['sectionId'] == null) continue;
        else section = data[i]['sectionId'];

        if (data[i]['webPublicationDate'] == null) continue;
        else date = data[i]['webPublicationDate'].substring(0,10);

        if (data[i]['blocks']['body'][0]['bodyTextSummary'] == null || data[i]['blocks']['body'][0]['bodyTextSummary'] === "") continue;
        else description = data[i]['blocks']['body'][0]['bodyTextSummary'];

        if (data[i]['webUrl'] == null) continue;
        else url = data[i]['webUrl'];

        jsonObj.id = id;
        jsonObj.title = title;
        jsonObj.image = image;
        jsonObj.section = section;
        jsonObj.date = date;
        jsonObj.description = description;
        jsonObj.url = url;
        newData.push(jsonObj);
    }
    return newData;
}

function filterArticleData(data) {
    data = data['response']['content'];

    let jsonObj = {
        'name': 'guardian',
        'title': '',
        'image': '',
        'date': '',
        'description': '',
        'section': ''
    };

    jsonObj.title = data['webTitle'];
    jsonObj.section = data['sectionId'];

    let allImage = data['blocks']['main'];

    if (allImage == null ||
        allImage['elements'] == null ||
        allImage['elements'][0] == null ||
        allImage['elements'][0]['assets'] == null ||
        allImage['elements'][0]['assets'][allImage['elements'][0]['assets'].length - 1] == null ||
        allImage['elements'][0]['assets'][allImage['elements'][0]['assets'].length - 1]['file'] == null ||
        allImage['elements'][0]['assets'].length === 0) {
        jsonObj.image = "https://assets.guim.co.uk/images/eada8aa27c12fe2d5afa3a89d3fbae0d/fallback-logo.png";
    }
    else {
        jsonObj.image = allImage['elements'][0]['assets'][allImage['elements'][0]['assets'].length - 1]['file'];
    }

    jsonObj.date = data['webPublicationDate'].substring(0,10);

    jsonObj.description = data['blocks']['body'][0]['bodyTextSummary'];

    return jsonObj;
}

router.get('/home', function (req, res) {
    let apiurl = 'https://content.guardianapis.com/search?api-key=' + guardianApiKey + '&section=(sport|business|technology|politics)&show-blocks=all';
    request(apiurl, {json: true}, (error, response, body) => {
        if (error) {
            res.send(console.log(error));
        } else if (!error && res.statusCode === 200) {
            res.send(filterTabData(body));
        }
    });
});

router.get('/section/:section', function (req, res) {
    let apiurl = 'https://content.guardianapis.com/search?api-key=' + guardianApiKey + '&section=' + req.params.section + '&show-blocks=all';
    request(apiurl, {json: true}, (error, response, body) => {
        if (error) {
            res.send(console.log(error));
        } else if (!error && res.statusCode === 200) {
            res.send(filterTabData(body));
        }
    });
});

router.get('/article', function (req, res) {
    let id = url.parse(req.url, true).query.id;
    let apiurl = 'https://content.guardianapis.com/' + id +'?api-key=' + guardianApiKey + '&show-blocks=all';
    request(apiurl, {json: true}, (error, response, body) => {
        if (error) {
            res.send(console.log(error));
        } else if (!error && res.statusCode === 200) {
            res.send(filterArticleData(body));
        }
    });
});

router.get('/search', function (req, res) {
    let queryKeyword = url.parse(req.url, true).query.q;
    let apiurl = 'https://content.guardianapis.com/search?q='+ queryKeyword + '&api-key=' + guardianApiKey +'&show-blocks=all';
    request(apiurl, {json: true}, (error, response, body) => {
        if (error) {
            res.send(console.log(error));
        } else if (!error && res.statusCode === 200) {
            res.send(filterTabData(body));
        }
    });
});



module.exports = router;