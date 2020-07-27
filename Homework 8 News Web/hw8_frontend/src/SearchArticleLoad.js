import React from 'react';
import {Component} from 'react';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SearchBasedArticleCard from "./SearchBasedArticleCard";
import BounceLoader from "react-spinners/BounceLoader";

class SearchArticleLoad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: []
        };
    }

    fetchSearchData() {
        this.setState({loading: true});
        let newsName;
        localStorage.getItem('switchState') === 'true' ? newsName = 'guardian' : newsName = 'nytimes';
        let url = this.props.location.search;
        fetch("/" + newsName + "/search" + url)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    loading: false,
                    data: data
                })
            });
    }

    componentDidMount() {
        this.fetchSearchData();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.location.key !== this.props.location.key) {
            this.fetchSearchData();
        }
    }

    render() {




            if (this.state.loading === false) {
                return (
                    <>
                        <h style={{
                            fontSize: '25px',
                            marginLeft: '20px',
                            marginTop: '10px'
                        }}>
                            Results
                        </h>

                        <Container fluid>
                            <Row>
                                {this.state.data.map(article => <SearchBasedArticleCard
                                    title={article.title}
                                    image={article.image}
                                    date={article.date}
                                    section={article.section}
                                    id={article.id}
                                />)
                                }
                            </Row>
                        </Container>
                    </>
                )
            } else {
                return (
                    <div style={{
                        position: 'absolute',
                        margin: 'auto',
                        top: '50%',
                        left: '50%',
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

export default SearchArticleLoad;