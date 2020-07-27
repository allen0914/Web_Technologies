from filecmp import cmp

from flask import Flask, jsonify, request
from newsapi import NewsApiClient
import re

from newsapi.newsapi_exception import NewsAPIException

application = Flask(__name__)

newsapi = NewsApiClient(api_key='dfc820e9b3af4449ba0caac21266179d')


def select_headline(data, num):
    new_data = []
    count = 0
    articles = data['articles']

    for article in articles:

        flag = 1

        if article is None:
            continue

        for k in article:

            if k == 'source':
                for i in article[k]:
                    if article[k][i] is None:
                        flag = 0
                        break
            else:
                if article[k] is None:
                    flag = 0
                    break

            if flag == 0:
                break

        if flag == 1:
            new_data.append(article)
            count += 1

        if count == num:
            data['articles'] = new_data
            break

    return data


def select_search_card(data):
    new_data = []
    count = 0
    articles = data['articles']

    for article in articles:

        flag = 1

        if article is None:
            continue

        for k in article:

            if k == 'source':
                if article[k]['name'] is None:
                    flag = 0
                    break
            else:
                if article[k] is None:
                    flag = 0
                    break

            if flag == 0:
                break

        if flag == 1:
            new_data.append(article)
            count += 1

        if count == 15:
            break

    data['articles'] = new_data[:15]

    return data


def word_count(data):
    stop_words = []
    with open("stopwords_en.txt", "r") as f:
        for line in f:
            stop_words.append(line.strip('\n'))

    articles = data['articles']
    count = dict()
    words = ""

    for article in articles:
        if article is None:
            continue
        for k in article:
            if k == 'title':
                words += article[k] + " "

    split_words = words.split()

    for word in split_words:
        lower_word = word.lower()
        if lower_word in stop_words:
            continue
        else:
            clean_word = re.sub("[0-9:!,/– -/\/|;]+", "", word)
            if clean_word == "":
                continue
            if clean_word in count:
                count[clean_word] += 1
            else:
                count[clean_word] = 1

    sort_list = sorted(count.items(), key=lambda item: item[1], reverse=True)
    count = dict()
    for i in range(30):
        count[sort_list[i][0]] = sort_list[i][1]

    return count


def get_news_name(data, category):
    new_source = []
    source_data = data['sources']
    count = 0
    # print(source_data)

    if category == 'all':
        for source in source_data:
            new_source.append(source['name'])
        # print(new_source)
        return new_source

    else:
        for source in source_data:
            # print(source)
            if source['category'] == category:
                new_source.append(source['name'])
        # print(new_source)
        return new_source


def get_source_id(data, name):
    for source in data['sources']:
        if source['name'] == name:
            return source['id']


@application.route('/', methods=['GET', 'POST'])
def return_index():
    return application.send_static_file('index.html')


@application.route('/api/<source>', methods=['GET'])
def get_headline(source):
    if source == 'slides':
        data = newsapi.get_top_headlines(language='en', page_size=30)
        data = jsonify(select_headline(data, 5))
    else:
        data = newsapi.get_top_headlines(sources=source, language='en', page_size=30)
        data = jsonify(select_headline(data, 4))
    return data


@application.route('/api/word', methods=['GET'])
def get_wordcount():
    data = newsapi.get_top_headlines(language='en', page_size=30)
    print(word_count(data))
    return jsonify(word_count(data))


@application.route('/api/getsource/<category_val>', methods=['GET'])
def get_source(category_val):
    source = newsapi.get_sources(country='us', language='en')
    category_val = category_val.lower()
    data = jsonify(get_news_name(source, category_val))
    return data


@application.route('/api/search', methods=['GET'])
def get_result():
    keyword = request.args.get('keyword')
    from_date = request.args.get('from')
    to_date = request.args.get('to')
    source = request.args.get('source')

    source_data = newsapi.get_sources()
    source_id = get_source_id(source_data, source)

    if source == 'all':
        try:
            all_articles = newsapi.get_everything(q=keyword,
                                                  from_param=from_date,
                                                  to=to_date,
                                                  language='en',
                                                  page_size=30,
                                                  sort_by='publishedAt')
            # print(len(select_search_card(all_articles)['articles']))
            return jsonify(select_search_card(all_articles))
        except NewsAPIException as error_message:
            return jsonify(error_message.exception)

    else:
        try:
            all_articles = newsapi.get_everything(q=keyword,
                                                  sources=source_id,
                                                  from_param=from_date,
                                                  to=to_date,
                                                  language='en',
                                                  page_size=30,
                                                  sort_by='publishedAt')
            return jsonify(select_search_card(all_articles))
        except NewsAPIException as error_message:
            return jsonify(error_message.exception)


if __name__ == '__main__':
    application.run()