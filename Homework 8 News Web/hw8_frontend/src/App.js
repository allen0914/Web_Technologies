import React from 'react';
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "./NavBar";
import SearchArticleLoad from "./SearchArticleLoad";
import {Switch, Route} from "react-router-dom";
import DetailedArticlePage from "./DetailedArticlePage";
import ArticleLoad from "./ArticleLoad"
import 'react-toastify/dist/ReactToastify.css';
import BookmarkArticleLoad from "./BookmarkArticleLoad";

function App() {
    return (
        <div className="App">
            <NavBar/>
            <Switch>
                <Route exact path="/" component={ArticleLoad}/>
                <Route path="/world" component={ArticleLoad}/>
                <Route path="/politics" component={ArticleLoad}/>
                <Route path="/business" component={ArticleLoad}/>
                <Route path="/technology" component={ArticleLoad}/>
                <Route path="/sport" component={ArticleLoad}/>
                <Route path="/article" component={DetailedArticlePage}/>
                <Route path="/search" component={SearchArticleLoad}/>
                <Route path="/bookmark" component={BookmarkArticleLoad}/>
            </Switch>
        </div>
    );
}

export default App;
