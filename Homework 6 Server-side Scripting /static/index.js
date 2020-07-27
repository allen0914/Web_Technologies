window.onload = function () {
    tabControl();
    loadCnnJson();
    loadFoxJson();
    loadSlidesJson();
    autoSlide();
    loadWordCloud();
    getDate();
    loadSource();
};

var article_length = 0;

function tabControl() {
    var title1 = document.getElementById("google");
    var title2 = document.getElementById("search");
    var div1 = document.getElementById("page1");
    var div2 = document.getElementById("page2");

    title1.onclick = function () {
        div2.style.display = "none";
        div1.style.display = "block";
        document.getElementById("googlecolor").style.backgroundColor = "darkgray";
        document.getElementById("searchcolor").style.backgroundColor = "rgb(236, 235, 235)";
        document.getElementById("googlecolor").style.color = "white";
        document.getElementById("searchcolor").style.color = "black";

        title1.onmouseover = function () {
            document.getElementById("googlecolor").style.backgroundColor = "green";
            document.getElementById("googlecolor").style.color = "white";
        };

        title1.onmouseout = function () {
            document.getElementById("googlecolor").style.backgroundColor = "darkgray";
            document.getElementById("googlecolor").style.color = "white";
        };

        title2.onmouseover = function () {
            document.getElementById("searchcolor").style.backgroundColor = "green";
            document.getElementById("searchcolor").style.color = "white";
        };

        title2.onmouseout = function () {
            document.getElementById("searchcolor").style.backgroundColor = "rgb(236, 235, 235)";
            document.getElementById("searchcolor").style.color = "black";
        }
    };


    title2.onclick = function () {
        div1.style.display = "none";
        div2.style.display = "block";
        document.getElementById("searchcolor").style.backgroundColor = "darkgray";
        document.getElementById("googlecolor").style.backgroundColor = "rgb(236, 235, 235)";
        document.getElementById("searchcolor").style.color = "white";
        document.getElementById("googlecolor").style.color = "black";

        title1.onmouseover = function () {
            document.getElementById("googlecolor").style.backgroundColor = "green";
            document.getElementById("googlecolor").style.color = "white";
        };

        title1.onmouseout = function () {
            document.getElementById("googlecolor").style.backgroundColor = "rgb(236, 235, 235)";
            document.getElementById("googlecolor").style.color = "black";
        };

        title2.onmouseover = function () {
            document.getElementById("searchcolor").style.backgroundColor = "green";
            document.getElementById("searchcolor").style.color = "white";
        };

        title2.onmouseout = function () {
            document.getElementById("searchcolor").style.backgroundColor = "darkgray";
            document.getElementById("searchcolor").style.color = "white";
        }
    };
}

function loadCnnJson() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "/api/cnn", true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
            cnnObj = JSON.parse(xmlhttp.response);

            document.getElementById("news_card_img1").src = cnnObj['articles'][0]['urlToImage'];
            document.getElementById("news_card_img2").src = cnnObj['articles'][1]['urlToImage'];
            document.getElementById("news_card_img3").src = cnnObj['articles'][2]['urlToImage'];
            document.getElementById("news_card_img4").src = cnnObj['articles'][3]['urlToImage'];

            document.getElementById("news_card_title1").innerHTML = cnnObj['articles'][0]['title'];
            document.getElementById("news_card_title2").innerHTML = cnnObj['articles'][1]['title'];
            document.getElementById("news_card_title3").innerHTML = cnnObj['articles'][2]['title'];
            document.getElementById("news_card_title4").innerHTML = cnnObj['articles'][3]['title'];

            document.getElementById("news_card_dis1").innerHTML = cnnObj['articles'][0]['description'];
            document.getElementById("news_card_dis2").innerHTML = cnnObj['articles'][1]['description'];
            document.getElementById("news_card_dis3").innerHTML = cnnObj['articles'][2]['description'];
            document.getElementById("news_card_dis4").innerHTML = cnnObj['articles'][3]['description'];

            document.getElementById("news_card_link1").href = cnnObj['articles'][0]['url'];
            document.getElementById("news_card_link2").href = cnnObj['articles'][1]['url'];
            document.getElementById("news_card_link3").href = cnnObj['articles'][2]['url'];
            document.getElementById("news_card_link4").href = cnnObj['articles'][3]['url'];

            //console.log(cnnObj)

        }
    };
    xmlhttp.send();
}

function loadFoxJson() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "/api/fox-news", true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
            foxObj = JSON.parse(xmlhttp.response);

            document.getElementById("news_card_img5").src = foxObj['articles'][0]['urlToImage'];
            document.getElementById("news_card_img6").src = foxObj['articles'][1]['urlToImage'];
            document.getElementById("news_card_img7").src = foxObj['articles'][2]['urlToImage'];
            document.getElementById("news_card_img8").src = foxObj['articles'][3]['urlToImage'];

            document.getElementById("news_card_title5").innerHTML = foxObj['articles'][0]['title'];
            document.getElementById("news_card_title6").innerHTML = foxObj['articles'][1]['title'];
            document.getElementById("news_card_title7").innerHTML = foxObj['articles'][2]['title'];
            document.getElementById("news_card_title8").innerHTML = foxObj['articles'][3]['title'];

            document.getElementById("news_card_dis5").innerHTML = foxObj['articles'][0]['description'];
            document.getElementById("news_card_dis6").innerHTML = foxObj['articles'][1]['description'];
            document.getElementById("news_card_dis7").innerHTML = foxObj['articles'][2]['description'];
            document.getElementById("news_card_dis8").innerHTML = foxObj['articles'][3]['description'];

            document.getElementById("news_card_link5").href = foxObj['articles'][0]['url'];
            document.getElementById("news_card_link6").href = foxObj['articles'][1]['url'];
            document.getElementById("news_card_link7").href = foxObj['articles'][2]['url'];
            document.getElementById("news_card_link8").href = foxObj['articles'][3]['url'];

            //console.log(foxObj)

        }
    };
    xmlhttp.send();
}


function loadSlidesJson() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "/api/slides", true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
            slidesObj = JSON.parse(xmlhttp.response);

            //console.log(slidesObj);

            for (var i = 1; i < 6; i++) {
                document.getElementById("news_slide_title" + i).innerHTML = slidesObj['articles'][i - 1]['title'];
                document.getElementById("news_slide_content" + i).innerHTML = slidesObj['articles'][i - 1]['description'];
                document.getElementById("news_slide_image" + i).src = slidesObj['articles'][i - 1]['urlToImage'];
                document.getElementById("news_slide_link" + i).href = slidesObj['articles'][i - 1]['url'];
                document.getElementsByClassName("news_slide")[i].style.display = "none";
            }


        }
    };
    xmlhttp.send();
}


function loadWordCloud() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "/api/word", true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
            wordCloudObj = JSON.parse(xmlhttp.response);

            //console.log(wordCloudObj);
            var result = [];
            for (var i in wordCloudObj) {
                result.push([i, wordCloudObj[i]]);
            }

            //console.log(result);

            wordCloud(result);

            function wordCloud(wordList) {
                var margin = {top: 0, right: 0, bottom: 0, left: 0},
                    width = 300,
                    height = 250;

                var svg = d3.select("#word_cloud").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform",
                        "translate(" + margin.left + "," + margin.top + ")");

                var layout = d3.layout.cloud()
                    .size([width, height])
                    .words(wordList.map(function (d) {
                        return {text: d[0], size: d[1] * 6};
                    }))
                    .padding(4)
                    .rotate(function () {
                        return ~~(Math.random() * 2) * 90;
                    })
                    .fontSize(function (d) {
                        return d.size;
                    })      // font size of words
                    .on("end", draw);
                layout.start();

                function draw(words) {
                    svg
                        .append("g")
                        .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
                        .selectAll("text")
                        .data(words)
                        .enter().append("text")
                        .style("font-size", function (d) {
                            return d.size + 'px';
                        })
                        .style("fill", "black")
                        .attr("text-anchor", "middle")
                        .style("font-family", "Impact")
                        .attr("transform", function (d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .text(function (d) {
                            return d.text;
                        });
                }
            }
        }
    };
    xmlhttp.send();
}


function autoSlide() {
    var news_slide = document.getElementsByClassName("news_slide");
    var time = null;
    var count = -1;

    function autoPlay() {
        count++;

        if (count > 4) {
            count = 0;
        }

        for (var i = 0; i < news_slide.length; i++) {
            news_slide[i].style.display = "none"
        }

        news_slide[count].style.display = "block";
    }

    time = setInterval(autoPlay, 2000);
}


function searchErrorHandle() {
    //document.getElementsByClassName("search_result")[0].style.display = "none";

    var keyword = document.getElementById("search_text");
    var fromDate = document.getElementById("search_from_date");
    var toDate = document.getElementById("search_to_date");
    //var category = document.getElementById("search_category");

    if (!keyword.checkValidity()) {
        keyword.reportValidity();
        return;
    }

    if (!fromDate.checkValidity()) {
        fromDate.reportValidity();
        return;
    }

    if (!toDate.checkValidity()) {
        toDate.reportValidity();
        return;
    }

    //var keywordVal = keyword.value;
    var fromDateVal = fromDate.value;
    var toDateVal = toDate.value;
    //var categoryVal = category.value;

    //console.log(fromDateVal);
    //console.log(toDateVal);

    var fromDateArr = fromDateVal.split("-");
    var toDateArr = toDateVal.split("-");
    //console.log(fromDateArr);
    //console.log(toDateArr);

    if (fromDateArr[1] > toDateArr[1] ||
        ((fromDateArr[1] === toDateArr[1]) && (fromDateArr[2] > toDateArr[2]))) {
        alert("Incorrect time");
        return 1;
    }
}

function loadSource() {
    var categoryVal = document.getElementById("search_category").value;

    //console.log(categoryVal);

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.open("GET", "/api/getsource/" + categoryVal, true);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
            sourceObj = JSON.parse(xmlhttp.response);
            //console.log(sourceObj);
            var parent = document.getElementById("source_select");
            //console.log(sourceObj.length);

            document.getElementById("source_select").length = 1;

            for (var i = 0; i < sourceObj.length; i++) {
                parent.add(new Option(sourceObj[i], sourceObj[i]));
            }
        }
    };
    xmlhttp.send();
}

function clearSearchRequest() {
    document.getElementById("search_text").value = "";
    document.getElementById("search_from_date").value = "";
    document.getElementById("search_to_date").value = "";
    document.getElementById("search_category").value = "all";
    document.getElementsByClassName("search_result")[0].style.display = "none";
    document.getElementById("no_search_result").style.display = "none";
    getDate();
    loadSource();


}

function loadSearchNews() {

    var keyword = document.getElementById("search_text").value;
    var fromDate = document.getElementById("search_from_date").value;
    var toDate = document.getElementById("search_to_date").value;
    var source = document.getElementById("source_select").value;

    if (keyword === "" || fromDate === "" || toDate === "") {
        searchErrorHandle();
    } else {

        if (searchErrorHandle() === 1) return;
        var url = "keyword=" + keyword + "&from=" + fromDate + "&to=" + toDate + "&source=" + source;
        //console.log(url);

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "/api/search?" + url, true);

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
                searchObj = JSON.parse(xmlhttp.response);
                //console.log(searchObj);
                if (searchObj['code'] === "parameterInvalid") {
                    alert(searchObj['message']);
                } else {
                    for (var i = 0; i < 15; i++) {
                        document.getElementsByClassName("search_card_2")[i].style.display = "none";
                        document.getElementsByClassName("search_card_1")[i].style.display = "block";
                    }
                    fillSearchNews(searchObj);

                }
            }
        };
        xmlhttp.send();


    }


}

function fillSearchNews(jsonObj) {
    var articles = jsonObj['articles'];
    article_length = articles.length;

    if (articles.length === 0) {
        document.getElementById("no_search_result").style.display = "block";
        document.getElementsByClassName("search_result")[0].style.display = "none";
    } else {
        document.getElementById("no_search_result").style.display = "none";
        document.getElementsByClassName("search_result")[0].style.display = "block";
        for (var i = 0; i < 15; i++) {
            if (typeof (articles[i]) === 'undefined') {
                break;
            } else {
                var date = articles[i]['publishedAt'].substring(0, 10);
                var dateArr = date.split("-");
                var newDate = dateArr[1] + "/" + dateArr[2] + "/" + dateArr[0];

                var wordArr = articles[i]['description'].split(" ");
                var brief = " ";

                for (var j = 0; j < 9; j++) {
                    brief += wordArr[j] + " ";
                }
                brief = brief + wordArr[9] + "...";

                document.getElementsByClassName("search_card_img")[i].src = articles[i]['urlToImage'];
                document.getElementsByClassName("search_card_title")[i].innerHTML = articles[i]['title'];
                document.getElementsByClassName("search_card_brief")[i].innerHTML = brief;
                document.getElementsByClassName("search_card_author")[i].innerHTML = "<b>Author: </b>" + articles[i]['author'];
                document.getElementsByClassName("search_card_source")[i].innerHTML = "<b>Source: </b>" + articles[i]['source']['name'];
                document.getElementsByClassName("search_card_date")[i].innerHTML = "<b>Date: </b>" + newDate;
                document.getElementsByClassName("search_card_description")[i].innerHTML = articles[i]['description'];
                document.getElementsByClassName("search_card_link")[i].href = articles[i]['url'];
                document.getElementsByClassName("search_card_link")[i].innerHTML = "See Original Post";
                document.getElementsByClassName("search_card_link")[i].target = "_blank";
                document.getElementsByClassName("x")[i].style.display = "none";
            }
        }


        if (articles.length <= 5) {
            for (var i = articles.length; i < 15; i++) {
                document.getElementsByClassName("search_card")[i].style.display = "none";
            }
            document.getElementsByClassName("show_more_button")[0].style.display = "none";
            document.getElementsByClassName("show_less_button")[0].style.display = "none";
        } else {
            for (var i = 5; i < 15; i++) {
                document.getElementsByClassName("search_card")[i].style.display = "none";
            }
            document.getElementsByClassName("show_more_button")[0].style.display = "block";
            document.getElementsByClassName("show_less_button")[0].style.display = "none";
        }
    }
}

function showMoreResult() {
    for (var i = 5; i < article_length; i++) {
        document.getElementsByClassName("search_card")[i].style.display = "block";
    }
    document.getElementsByClassName("show_less_button")[0].style.display = "block";
    document.getElementsByClassName("show_more_button")[0].style.display = "none";
}

function showLessResult() {
    for (var i = 5; i < article_length; i++) {
        document.getElementsByClassName("search_card")[i].style.display = "none";
    }
    document.getElementsByClassName("show_less_button")[0].style.display = "none";
    document.getElementsByClassName("show_more_button")[0].style.display = "block";

}

function showDetail(index) {
    document.getElementsByClassName("search_card_1")[index].style.display = "none";
    document.getElementsByClassName("search_card_2")[index].style.display = "block";
    document.getElementsByClassName("x")[index].style.display = "block";
}

function showBrief(index) {
    // document.getElementsByClassName("search_card")[0].addEventListener("click", function (e) {
    //     console.log(e);
    // })
    event.stopPropagation();
    document.getElementsByClassName("search_card_1")[index].style.display = "block";
    document.getElementsByClassName("search_card_2")[index].style.display = "none";
    document.getElementsByClassName("x")[index].style.display = "none";

}

function writeDate(date) {
    var cur_year = date.getFullYear();
    var cur_month = date.getMonth() + 1;
    var cur_day = date.getDate();

    if (cur_month < 10) {
        cur_month = "0" + cur_month;
    }
    if (cur_day < 10) {
        cur_day = "0" + cur_day;
    }

    return cur_year + "-" + cur_month + "-" + cur_day;
}

function getDate() {
    var to_date = new Date();
    document.getElementById("search_to_date").value = writeDate(to_date);
    //console.log(writeDate(to_date));

    var from_date = new Date();
    from_date.setDate((to_date.getDate() - 7));
    //console.log(writeDate(from_date));

    document.getElementById("search_from_date").value = writeDate(from_date);
}