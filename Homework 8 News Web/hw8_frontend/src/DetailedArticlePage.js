import React from 'react';
import {Component} from 'react';
import Card from "react-bootstrap/Card";
import BounceLoader from "react-spinners/BounceLoader";
import Truncate from "react-truncate";
import {MdExpandMore, MdExpandLess} from "react-icons/md";
import {
    FacebookShareButton,
    TwitterShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    EmailIcon
} from "react-share";
import {IconContext} from "react-icons";
import {FaRegBookmark, FaBookmark} from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';
import {ToastContainer, toast} from 'react-toastify';
import { cssTransition } from 'react-toastify';

import CommentBoxCard from "./CommentBoxCard";
import { css } from 'glamor';
import './style.css';
import queryString from 'query-string';

import {
    BrowserRouter as Router,
    Link,
} from "react-router-dom";
import * as Scroll from 'react-scroll';



const Zoom = cssTransition({
    enter: 'zoomIn',
    exit: 'zoomOut',
    duration: 750,
});
let scroll = Scroll.animateScroll;
let scroller = Scroll.scroller;

let Events = Scroll.Events;


class DetailedArticlePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            data: [],
            truncated: false,
            expanded: false,
            bookmark: false
        };
        this.handleTruncate = this.handleTruncate.bind(this);
        this.toggleLinesMore = this.toggleLinesMore.bind(this);
        this.toggleLinesLess = this.toggleLinesLess.bind(this);
    }



    fetchArticleData() {
        let values = queryString.parse(this.props.location.search);
        // console.log(values);

        fetch("/" + values.source + "/article?id=" + values.id)
            .then(response => response.json())
            .then(data => {
                this.setState({
                    loading: false,
                    data: data
                })
            });
    }

    componentDidMount() {
        this.fetchArticleData();
    }




    handleTruncate(truncated) {
        if (this.state.truncated !== truncated) {
            this.setState({
                truncated
            });
        }
    }

    toggleLinesMore(event) {
        event.preventDefault();

        this.setState({
            expanded: !this.state.expanded
        });

        scroller.scrollTo('scrollMoreElement', {
            smooth: true,
            dalay: 0
        })

    }

    toggleLinesLess(event) {
        event.preventDefault();

        this.setState({
            expanded: !this.state.expanded
        });

        scroller.scrollTo('scrollLessElement', {
            smooth: true,
            delay: 0
        });
    }


    render() {


        let url;
        if (localStorage.getItem('switchState') === 'true') {
            url = 'https://www.theguardian.com/' + this.props.location.search.substring(4, this.props.location.search.substring(4).length - 12);
        } else {
            url = this.props.location.search.substring(4, this.props.location.search.substring(4).length - 11);
        }

        let twitterShare = [];
        twitterShare[0] = "CSCI_571_NewsApp";

        let displayMoreBottom = "none";
        let displayLessBottom = "none";
        let displayBriefText = "none";
        let displayFullText = "none";
        let displayNoneBookmark = "block";
        let displayFullBookmark = "none";

        if (this.state.bookmark === true ||
            localStorage.getItem(this.props.location.search.substring(4)) != null) {
            displayNoneBookmark = "none";
            displayFullBookmark = "block";
        } else {
            displayNoneBookmark = "block";
            displayFullBookmark = "none";
        }


        if (this.state.truncated === false && this.state.expanded === false) {
            displayMoreBottom = "none";
            displayLessBottom = "none";
            displayBriefText = "none";
            displayFullText = "block";
        }

        if (this.state.truncated === true && this.state.expanded === false) {
            displayMoreBottom = "block";
            displayLessBottom = "none";
            displayBriefText = "block";
            displayFullText = "none";
        }

        if (this.state.truncated === true && this.state.expanded === true) {
            displayMoreBottom = "none";
            displayLessBottom = "block";
            displayBriefText = "none";
            displayFullText = "block";
        }

        if (this.state.loading === false) {
            return (
                <>
                    <ToastContainer
                        position={toast.POSITION.TOP_CENTER}
                        autoClose={2000}
                        hideProgressBar={true}
                        pauseOnHover={false}
                    />

                    <Scroll.Element name="scrollLessElement">
                    </Scroll.Element>
                    <Card style={{
                        cursor: "pointer",
                        boxShadow: '2px 2px 5px #d0d0d0',
                        marginLeft: '20px',
                        marginRight: '20px',
                        marginTop: '10px',
                        marginBottom: '10px',
                    }}>

                        <div style={{
                            marginLeft: '20px',
                            marginRight: '20px',
                            marginTop: '20px'
                        }}>
                            <Card.Title style={{
                                fontStyle: 'italic'
                            }}>
                                {this.state.data.title}
                            </Card.Title>

                            <span style={{
                                marginLeft: '10px'
                            }}>
                        {this.state.data.date}
                    </span>


                            <div style={{
                                float: 'right',
                                marginRight: '5px',
                                display: displayNoneBookmark
                            }}>
                                <IconContext.Provider
                                    value={{color: 'red', size: '1.5em'}}>
                                    <FaRegBookmark
                                        data-tip='Bookmark'
                                        onClick={() => {
                                            toast('Saving ' + this.state.data.title, {
                                                transition: Zoom,
                                                autoClose: 2000,
                                                bodyClassName: css({
                                                    color: 'black'
                                                })
                                            });
                                            this.setState({bookmark: true});
                                            let bookmarkData = {
                                                'name': this.state.data.name,
                                                'id': this.props.location.search.substring(4),
                                                'title': this.state.data.title,
                                                'date': this.state.data.date,
                                                'image': this.state.data.image,
                                                'section': this.state.data.section

                                            };
                                            localStorage.setItem(this.props.location.search.substring(4), JSON.stringify(bookmarkData));
                                        }
                                        }
                                    />
                                    <ReactTooltip effect='solid'/>
                                </IconContext.Provider>
                            </div>

                            <div style={{
                                float: 'right',
                                marginRight: '5px',
                                display: displayFullBookmark
                            }}>
                                <IconContext.Provider
                                    value={{color: 'red', size: '1.5em'}}>
                                    <FaBookmark
                                        data-tip='Bookmark'
                                        onClick={() => {
                                            toast('Removing ' + this.state.data.title, {
                                                transition: Zoom,
                                                autoClose: 2000,
                                                bodyClassName: css({
                                                    color: 'black'
                                                })
                                            });
                                            this.setState({bookmark: false});
                                            localStorage.removeItem(this.props.location.search.substring(4));
                                        }}
                                    />
                                    <ReactTooltip effect='solid'/>
                                </IconContext.Provider>
                            </div>


                            <div style={{
                                float: 'right',
                                marginRight: '40px'
                            }}>
                                <FacebookShareButton
                                    data-tip='Facebook'
                                    url={url}
                                    hashtag={"#CSCI_571_NewsApp"}>
                                    <FacebookIcon size={30} round={true}/>
                                    <ReactTooltip effect='solid'/>
                                </FacebookShareButton>

                                <TwitterShareButton
                                    data-tip='Twitter'
                                    url={url}
                                    hashtags={twitterShare}>
                                    <TwitterIcon size={30} round={true}/>
                                    <ReactTooltip effect='solid'/>
                                </TwitterShareButton>

                                <EmailShareButton
                                    data-tip='Email'
                                    url={url}
                                    subject={"#CSCI_571_NewsApp"}>
                                    <EmailIcon size={30} round={true}/>
                                    <ReactTooltip effect='solid'/>
                                </EmailShareButton>
                            </div>

                            <Card.Img src={this.state.data.image}/>


                            <Card.Text style={{
                                marginBottom: '50px'
                            }}
                            >

                                <Truncate
                                    lines={6}
                                    ellipsis={""}
                                    trimWhitespace={true}
                                    onTruncate={this.handleTruncate}
                                    style={{
                                        display: displayBriefText,
                                    }}
                                >
                                    {this.state.data.description}
                                </Truncate>


                                <Scroll.Element name="scrollMoreElement">
                                    <p
                                        style={{
                                            display: displayFullText,
                                        }}>
                                        {this.state.data.description}
                                    </p>
                                </Scroll.Element>


                                <MdExpandMore
                                    size={30}
                                    style={{
                                        display: displayMoreBottom,
                                        marginTop: '20px',
                                        float: 'right',
                                        cursor: 'default'
                                    }}
                                    onClick={this.toggleLinesMore}
                                />

                                <MdExpandLess
                                    size={30}
                                    style={{
                                        display: displayLessBottom,
                                        marginTop: '20px',
                                        float: 'right',
                                        cursor: 'default'
                                    }}

                                    onClick={this.toggleLinesLess}

                                />
                            </Card.Text>
                        </div>
                    </Card>

                    <CommentBoxCard id={this.props.location.search.substring(4)}/>

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

export default DetailedArticlePage;