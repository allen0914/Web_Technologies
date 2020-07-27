const express = require('express');
const router = express.Router();
const request = require('request');
const url = require("url");

const timesApiKey = 'GpcpMU54CwhMP3MVC3tlNokpgBGkQBAG';

function filterTabData(data) {
    data = data['results'];
    let newData = [];
    let count = 0;
    if (data == null) return;

    for (let i = 0; i < data.length; i++) {
        let title = '', image = '', section = '', date = '', description = '', url = '';

        let jsonObj = {
            'title': '',
            'image' : '',
            'section' : '',
            'date' : '',
            'description' : '',
            'url' : '',
        };

        if (data[i]['title'] == null) continue;
        else title = data[i]['title'];

        let allImage = data[i]['multimedia'];

        if (allImage !== null && allImage.length !== 0) {
            for (let j = 0; j < allImage.length; j++) {
                if (allImage[j] !== null &&
                    allImage[j]['url'] !== null &&
                    allImage[j]['url'] !== "" &&
                    allImage[j]['width'] > 2000) {
                    image = allImage[j]['url'];
                    break;
                }

                if (j === allImage.length - 1) {
                    image = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                }
            }
        }
        else {
            image = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
        }

        if (data[i]['section'] == null) continue;
        else section = data[i]['section'];

        if (data[i]['published_date'] == null) continue;
        else date = data[i]['published_date'].substring(0,10);

        if (data[i]['abstract'] == null) continue;
        else description = data[i]['abstract'];

        if (data[i]['url'] == null) continue;
        else url = data[i]['url'];

        jsonObj.title = title;
        jsonObj.image = image;
        jsonObj.section = section;
        jsonObj.date = date;
        jsonObj.description = description;
        jsonObj.url = url;
        newData.push(jsonObj);
        count++;

        if (count === 10) break;
    }
    return newData;
}

function filterSearchData(data) {
    data = data['response']['docs'];
    let newData = [];
    if (data == null) return;

    for (let i = 0; i < data.length; i++) {
        let title = '', image = '', section = '', date = '', id = '';

        let jsonObj = {
            'title': '',
            'image' : '',
            'section' : '',
            'date' : '',
            'id' : '',
        };

        if (data[i]['headline']['main'] == null) continue;
        else title = data[i]['headline']['main'];

        let allImage = data[i]['multimedia'];

        if (allImage !== null && allImage.length !== 0) {
            for (let j = 0; j < allImage.length; j++) {
                if (allImage[j] !== null &&
                    allImage[j]['url'] !== null &&
                    allImage[j]['url'] !== "" &&
                    allImage[j]['width'] > 2000) {
                    image = "https://www.nytimes.com/" + allImage[j]['url'];
                    break;
                }

                if (j === allImage.length - 1) {
                    image = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
                }
            }
        }
        else {
            image = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
        }

        if (data[i]['news_desk'] === null || data[i]['news_desk'] === "") continue;
        else section = data[i]['news_desk'];

        if (data[i]['pub_date'] === null) continue;
        else date = data[i]['pub_date'].substring(0,10);


        if (data[i]['web_url'] == null) continue;
        else id = data[i]['web_url'];

        jsonObj.title = title;
        jsonObj.image = image;
        jsonObj.section = section;
        jsonObj.date = date;
        jsonObj.id = id;
        newData.push(jsonObj);
    }
    return newData;
}




function filterArticleData(data) {
    data = data['response']['docs'][0];
    let jsonObj = {
        'name': 'nytimes',
        'title': '',
        'image': '',
        'date': '',
        'description': '',
        'section': ''
    };

    jsonObj.title = data['headline']['main'];

    jsonObj.date = data['pub_date'].substring(0, 10);

    jsonObj.section = data['news_desk'];

    if (data['multimedia'] !== null && data['multimedia'].length !== 0) {
        for (let i = 0; i < data['multimedia'].length; i++) {
            if (data['multimedia'][i]['url'] !== null &&
                data['multimedia'][i]['url'] !== '' &&
                data['multimedia'][i]['width'] >= 2000) {
                jsonObj.image = "https://www.nytimes.com/" + data['multimedia'][i]['url'];
                break;
            }

            if (i === data['multimedia'].length - 1) {
                jsonObj.image = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
            }
        }
    }
    else {
        jsonObj.image = "https://upload.wikimedia.org/wikipedia/commons/0/0e/Nytimes_hq.jpg";
    }

    jsonObj.description = data['abstract'];

    return jsonObj;

}

router.get('/home', function (req, res) {
    let apiurl = 'https://api.nytimes.com/svc/topstories/v2/home.json?api-key=' + timesApiKey;
    request(apiurl, {json: true}, (error, response, body) => {
        if (error) {
            res.send(console.log(error));
        } else if (!error && res.statusCode === 200) {
            res.send(filterTabData(body));
        }
    });
});

router.get('/section/:section', function (req, res) {
    let apiurl = 'https://api.nytimes.com/svc/topstories/v2/' + req.params.section + '.json?api-key=' + timesApiKey;
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
    let apiurl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=web_url:("' + id + '")&api-key=' + timesApiKey;
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
    let apiurl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + queryKeyword + '&api-key=' + timesApiKey;
    request(apiurl, {json: true}, (error, response, body) => {
        if (error) {
            res.send(console.log(error));
        } else if (!error && res.statusCode === 200) {
            res.send(filterSearchData(body));
        }
    });
});

module.exports = router;