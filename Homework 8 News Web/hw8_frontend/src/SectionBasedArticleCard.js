import React from 'react';
import {Component} from 'react';
import {Container, Row, Col, Image, Badge, Card} from "react-bootstrap";
import Truncate from 'react-truncate';
import {withRouter} from 'react-router-dom';
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


class SectionBasedArticleCard extends Component {
    backgroundColor;
    fontColor;
    sectionName;

    constructor() {
        super();
        this.state = {
            isClicked: false,
            loading: true,
            show: false
        };
        this.handleClick = this.handleClick.bind(this);
    }


    setSectionColorAndName(section) {
        if (section === 'world') {
            this.backgroundColor = "#7554FA";
            this.fontColor = "#FFFFFF";
            this.sectionName = 'world';
        } else if (section === 'politics') {
            this.backgroundColor = "#439488";
            this.fontColor = "#FFFFFF";
            this.sectionName = 'politics';
        } else if (section === 'business') {
            this.backgroundColor = "#3F98E8";
            this.fontColor = "#FFFFFF";
            this.sectionName = 'business';
        } else if (section === 'technology') {
            this.backgroundColor = "#D0DA4F";
            this.fontColor = "#000000";
            this.sectionName = 'technology';
        } else if (section === 'sport' || section === 'sports') {
            this.backgroundColor = "#F7C153";
            this.fontColor = "#000000";
            this.sectionName = 'sports';
        } else if (section === 'health') {
            this.backgroundColor = "#6E757B";
            this.fontColor = "#FFFFFF";
            this.sectionName = 'health';
        } else {
            this.backgroundColor = "#6E757B";
            this.fontColor = "#FFFFFF";
            this.sectionName = section;
        }
    }

    handleClick() {
        this.setState(state => ({
            isClicked: !state.isClicked
        }));

        if (localStorage.getItem('switchState') === 'true') {
            this.props.history.push("article?id=" + this.props.guardianArticleId + '&source=guardian');
        } else {
            this.props.history.push("article?id=" + this.props.timesArticleId + '&source=nytimes');
        }
    }


    render() {
        let twitterShare = [];
        twitterShare[0] = "CSCI_571_NewsApp";

        this.setSectionColorAndName(this.props.section);
        let url = "";
        if (localStorage.getItem('switchState') === 'true') {
            url = 'https://www.theguardian.com/' + this.props.guardianArticleId;
        } else {
            url = this.props.timesArticleId;
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

                <Card
                    onClick={this.handleClick}
                    style={{
                        cursor: "pointer",
                        marginLeft: "15px",
                        marginRight: "15px",
                        marginTop: "20px",
                        boxShadow: '2px 2px 5px #d0d0d0',
                    }}>

                    <Container fluid>

                        <Row>
                            <Col md={3}>
                                <Image style={{marginTop: "10px", marginBottom: "10px"}}
                                       src={this.props.image}
                                       thumbnail/>
                            </Col>

                            <Col md={9}>
                                <Card.Title style={{
                                    marginTop: "10px",
                                    fontWeight: "bold",
                                    fontStyle: "italic",
                                    fontSize: "22px"
                                }}>
                                    {this.props.title}

                                    <MdShare onClick={(e) => {
                                        this.setState({show: true});
                                        e.stopPropagation();
                                    }}/>

                                </Card.Title>

                                <p style={{fontSize: '19px'}}>
                                    <Truncate lines={3}>
                                        {this.props.content}
                                    </Truncate>
                                </p>

                                <span style={{fontStyle: "italic"}}>
                                {this.props.date}
                            </span>

                                <Badge style={{
                                    backgroundColor: this.backgroundColor,
                                    color: this.fontColor,
                                    float: 'right',
                                    fontSize: '15px',
                                    textTransform: 'uppercase'
                                }}>

                                    {this.sectionName}

                                </Badge>
                            </Col>
                        </Row>
                    </Container>
                </Card>
            </>
        )
    }
}


export default withRouter(SectionBasedArticleCard);