import React from 'react';
import {Component} from 'react';
import SectionBasedArticleCard from "./SectionBasedArticleCard";
import BounceLoader from "react-spinners/BounceLoader"

class ArticleLoad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: []
        };
        // this.handleClick = this.handleClick.bind(this);
    }

    fetchSectionData() {
        let newsName = '';
        if (localStorage.getItem('switchState') === 'true') {
            newsName = 'guardian';
        } else {
            newsName = 'nytimes';
        }

        let location = '';
        if (this.props.location.pathname === "/") location = "/home";

        else {
            if (newsName === 'nytimes' && this.props.location.pathname === '/sport') {
                location = "/section" + this.props.location.pathname + "s";
            } else {
                location = "/section" + this.props.location.pathname;
            }
        }

        fetch("/" + newsName + location)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    loading: false,
                    data: data
                })
            })
    }


    componentDidMount() {
        this.fetchSectionData();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.key !== this.props.location.key) {
            this.setState({loading: true});
            this.fetchSectionData();
        }
    }

    render() {
        let displayLoading = "block";
        if (window.screen.width < 800) {
            displayLoading = "none"
        }

        if (this.state.loading === false) {
            return (
                this.state.data.map(article => <SectionBasedArticleCard
                    title={article.title}
                    content={article.description}
                    image={article.image}
                    date={article.date}
                    section={article.section}
                    guardianArticleId={article.id}
                    timesArticleId={article.url}
                />)
            )
        } else {
            return (
                <div style={{
                    position: 'absolute',
                    transform: 'translate(-50%,-50%)',
                    left: '50%',
                    top: '50%',
                    display: displayLoading
                }}>
                        <BounceLoader
                            color={"#245ED2"}/>
                    <span style={{
                        fontSize: '20px'
                    }}> Loading </span>
                </div>


            )
        }
    }
}

export default ArticleLoad;