import React from 'react';
import {Component} from 'react';
import {Badge, Card, Col, Container, Image, Row} from "react-bootstrap";
import {MdShare, MdDelete} from "react-icons/md";
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
import Truncate from "react-truncate";
import {cssTransition, toast, ToastContainer} from "react-toastify";
import {css} from "glamor";

const Zoom = cssTransition({
    enter: 'zoomIn',
    exit: 'zoomOut',
    duration: 750,
});

class BookmarkBasedArticleCard extends Component {
    backgroundColor;
    fontColor;

    newsBackgroundColor;
    newsFontColor;

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

        this.props.history.push("/article?id=" + this.props.id);

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

    setNewsColor(news) {
        if (news === 'guardian') {
            this.newsBackgroundColor = '#122949';
            this.newsFontColor = "#FFFFFF";
        }
        else {
            this.newsBackgroundColor = '#DDDDDD';
            this.newsFontColor = "#000000";
        }
    }


    render() {
        let twitterShare = [];
        twitterShare[0] = "CSCI_571_NewsApp";

        this.setSectionColorAndName(this.props.section.toUpperCase());

        this.setNewsColor(this.props.name);
        let url = "";
        this.props.name === 'guardian' ? url = 'https://www.theguardian.com/' + this.props.id.substring(0, this.props.id.length - 16) : url = this.props.id.substring(0, this.props.id.length - 15);

        return (
            <>
                {/*<ToastContainer*/}
                {/*    position={toast.POSITION.TOP_CENTER}*/}
                {/*    autoClose={2000}*/}
                {/*    hideProgressBar={true}*/}
                {/*    pauseOnHover={false}*/}
                {/*/>*/}

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
        <p style={{marginBottom: '0px'}}><b>{this.props.name.toUpperCase()}</b>

        </p>
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
                            <Truncate lines={2}>
                                {this.props.title}
                            </Truncate>

                            <MdShare
                                style={{marginLeft: '10px'}}
                                onClick={(e) => {
                                    this.setState({show: true});
                                    e.stopPropagation();
                                }}/>


                            <MdDelete
                                onClick={(e) => {
                                    this.props.clickFunction(this.props.id);
                                    toast('Removing ' + this.props.title, {
                                        transition: Zoom,
                                        autoClose: 2000,
                                        bodyClassName: css({
                                            color: 'black'
                                        })
                                    });
                                    e.stopPropagation();
                                }}
                            />





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
                                backgroundColor: this.newsBackgroundColor,
                                color: this.newsFontColor,
                                marginLeft: '5px'

                            }}>
                                {this.props.name.toUpperCase()}
                            </Badge>


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


export default withRouter(BookmarkBasedArticleCard);