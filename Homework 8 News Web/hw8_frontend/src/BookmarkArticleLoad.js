import React, {Component} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import BookmarkBasedArticleCard from "./BookmarkBasedArticleCard";
import BounceLoader from "react-spinners/BounceLoader";
import {toast, ToastContainer} from "react-toastify";

class BookmarkArticleLoad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: []
        };
    }

    componentDidMount() {

        let rawData = [];
        let count = 0;
        for (let i=0, len = localStorage.length; i  <  len; i++){
            let key = localStorage.key(i);
            if (key === 'showSwitch' || key === 'switchState') {
                continue;
            }
            else {
                rawData[count++] = JSON.parse(localStorage.getItem(key));
            }
        }

        this.setState({
            loading: false,
            data: rawData
        });
    }

    click(id) {
        localStorage.removeItem(id);



        let rawData = [];
        let count = 0;
        for (let i=0, len = localStorage.length; i  <  len; i++){
            let key = localStorage.key(i);
            if (key === 'showSwitch' || key === 'switchState') {
                continue;
            }
            else {
                rawData[count++] = JSON.parse(localStorage.getItem(key));
            }
        }

        this.setState({
            loading: false,
            data: rawData
        });
    }

    render() {

        console.log(this.state.data);

        if (this.state.loading === false && localStorage.length > 1) {
            return (
                <>
                    <ToastContainer
                        position={toast.POSITION.TOP_CENTER}
                        autoClose={2000}
                        hideProgressBar={true}
                        pauseOnHover={false}
                    />

                    <h style={{
                        fontSize: '25px',
                        marginLeft: '20px',
                        marginTop: '10px'
                    }}>
                        Favorites
                    </h>


                    <Container fluid>
                        <Row>
                            {this.state.data.map(article => <BookmarkBasedArticleCard
                                title={article.title}
                                image={article.image}
                                date={article.date}
                                section={article.section}
                                id={article.id}
                                name={article.name}
                                clickFunction={this.click.bind(this)}
                            />)
                            }
                        </Row>
                    </Container>
                </>
            )
        } else if (this.state.loading === true) {
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
        } else if (this.state.loading === false && localStorage.length === 1) {
            return (
                <>
                    <ToastContainer
                        position={toast.POSITION.TOP_CENTER}
                        autoClose={2000}
                        hideProgressBar={true}
                        pauseOnHover={false}
                    />

                    <div style={{textAlign: 'center'}}>
                        <h
                            style={{
                                fontSize: '25px',
                                marginTop: '10px',
                            }}>
                            You have no saved articles
                        </h>
                    </div>
                </>

            )
        }
    }

}

export default BookmarkArticleLoad;