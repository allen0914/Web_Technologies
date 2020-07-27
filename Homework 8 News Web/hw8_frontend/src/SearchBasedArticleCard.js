import React from 'react';
import {Component} from 'react';
import {Badge, Card, Col, Container, Image, Row} from "react-bootstrap";
import {MdShare} from "react-icons/md";
import Modal from "react-bootstrap/Modal";
import {
    FacebookShareButton,
    TwitterShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    EmailIcon
} from "react-share";
import {withRouter} from "react-router-dom";

class SearchBasedArticleCard extends Component {
    backgroundColor;
    fontColor;

    constructor() {
        super();
        this.state = {
            loading: true,
            show: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(state => ({
            isClicked: !state.isClicked
        }));

        if (localStorage.getItem('switchState') === 'true') {
            this.props.history.push("article?id=" + this.props.id + '&source=guardian');
        } else {
            this.props.history.push("article?id=" + this.props.id + '&source=nytimes');
        }
    }

    setSectionColorAndName(section) {
        if (section === 'world'.toUpperCase()) {
            this.backgroundColor = "#7554FA";
            this.fontColor = "#FFFFFF";
        } else if (section === 'politics'.toUpperCase()) {
            this.backgroundColor = "#439488";
            this.fontColor = "#FFFFFF";
        } else if (section === 'business'.toUpperCase()) {
            this.backgroundColor = "#3F98E8";
            this.fontColor = "#FFFFFF";
        } else if (section === 'technology'.toUpperCase()) {
            this.backgroundColor = "#D0DA4F";
            this.fontColor = "#000000";
        } else if (section === 'sport'.toUpperCase() || section === 'sports'.toUpperCase()) {
            this.backgroundColor = "#F7C153";
            this.fontColor = "#000000";
        } else if (section === 'health'.toUpperCase()) {
            this.backgroundColor = "#6E757B";
            this.fontColor = "#FFFFFF";
        } else {
            this.backgroundColor = "#6E757B";
            this.fontColor = "#FFFFFF";
        }
    }

    render() {


        this.setSectionColorAndName(this.props.section.toUpperCase());

        let twitterShare = [];
        twitterShare[0] = "CSCI_571_NewsApp";


        let url = "";
        if (localStorage.getItem('switchState') === 'true') {
            url = 'https://www.theguardian.com/' + this.props.id;
        } else {
            url = this.props.id;
        }

        return (
            <>

                <Modal show={this.state.show}
                       onHide={() => {
                           this.setState({show: false});
                       }}
                       onClick={(e) => {
                           e.stopPropagation();
                       }}
                >
                    <Modal.Header closeButton>
                        <Modal.Title style={{
                            fontSize: '20px',
                        }}>
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{
                        textAlign: 'center',
                        fontSize: '20px'
                    }}>
                        Share Via
                    </Modal.Body>


                    <Row style={{textAlign: 'center'}}>
                        <Col>
                            <FacebookShareButton
                                url={url}
                                hashtag={"#CSCI_571_NewsApp"}>
                                <FacebookIcon size={50} round={true}/>
                            </FacebookShareButton>
                        </Col>

                        <Col>
                            <TwitterShareButton
                                url={url}
                                hashtags={twitterShare}>
                                <TwitterIcon size={50} round={true}/>
                            </TwitterShareButton>
                        </Col>

                        <Col>
                            <EmailShareButton
                                url={url}
                                subject={"#CSCI_571_NewsApp"}>
                                <EmailIcon size={50} round={true}/>
                            </EmailShareButton>
                        </Col>
                    </Row>

                </Modal>


                        <Col md={3}>
                            <Card
                                onClick={this.handleClick}
                                style={{
                                    cursor: "pointer",
                                    boxShadow: '2px 2px 5px #d0d0d0',
                                    marginLeft: '0px',
                                    marginRight: '0px',
                                    marginTop: '10px',
                                    marginBottom: '10px'
                                }}>

                                <Card.Title style={{
                                    marginTop: '20px',
                                    marginLeft: '20px',
                                    marginRight: '20px',
                                    fontStyle: 'italic',
                                    fontSize: '18px'
                                }}>
                                    {this.props.title}

                                    <MdShare
                                        style = {{marginLeft: '10px'}}
                                        onClick={(e) => {
                                        this.setState({show: true});
                                        e.stopPropagation();
                                    }}/>

                                </Card.Title>





                                <Image
                                    src={this.props.image}
                                    style={{
                                        marginBottom: '2px',
                                        marginLeft: '20px',
                                        marginRight: '20px',
                                    }}
                                    thumbnail>
                                </Image>

                                <Card.Text style={{
                                    marginTop: '5px',
                                    marginBottom: '30px',
                                    marginLeft: '20px',
                                    marginRight: '20px'
                                }}>

                                <span>
                                    {this.props.date}
                                </span>

                                    <Badge variant="primary" style={{
                                        float: 'right',
                                        backgroundColor: this.backgroundColor,
                                        color: this.fontColor,

                                    }}>
                                        {this.props.section.toUpperCase()}
                                    </Badge>
                                </Card.Text>
                            </Card>
                        </Col>
            </>
        )
    }
}


export default withRouter(SearchBasedArticleCard);