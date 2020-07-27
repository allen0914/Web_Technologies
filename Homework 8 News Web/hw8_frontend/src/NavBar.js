import React from 'react';
import {Component} from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import AsyncSelect from "react-select/lib/Async";
import Switch from "react-switch";
import {FaRegBookmark, FaBookmark} from 'react-icons/fa';
import {IconContext} from "react-icons";
import {NavLink, withRouter} from 'react-router-dom';
import ReactTooltip from 'react-tooltip'
import queryString from 'query-string';


const loadSearchResult = (inputValue) => {
    return fetch(
        'https://api.cognitive.microsoft.com/bing/v7.0/suggestions?&q=' + inputValue,
        {
            headers: {
                "Ocp-Apim-Subscription-Key": "5979a9450d97424281bef53534f9660b"
            }
        }
    )
        .then(response => response.json())
        .then(data => {
            let suggestionOptions = data.suggestionGroups[0].searchSuggestions;

            if (suggestionOptions.length > 0 && suggestionOptions[0].displayText === inputValue) {
                return suggestionOptions.map(result => ({
                    label: result.displayText,
                    value: result.displayText
                }));
            }

            else {
                return [{'displayText': inputValue}].concat(suggestionOptions).map(result => ({
                    label: result.displayText,
                    value: result.displayText
                }));
            }
        });
};


class NavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {value: null};

        if (localStorage.length === 0) {
            localStorage.setItem('switchState', true);
            this.state = {checked: true};
        } else {
            if (localStorage.getItem('switchState') === 'true' || localStorage.getItem('switchState') == null) {
                this.state = {checked: true};
            } else {
                this.state = {checked: false};
            }
        }



        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(checked) {
        if (localStorage.getItem('switchState') === 'true') {
            this.setState({checked: false});
            localStorage.setItem('switchState', false);
        } else {
            this.setState({checked: true});
            localStorage.setItem('switchState', true);
        }

        window.location.reload();
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location.pathname !== prevProps.location.pathname &&
            this.props.location.pathname !== '/search') {
            this.setState({value: null});
        }

        else if (this.props.location.pathname === prevProps.location.pathname &&
            this.props.location.pathname === '/search') {
            let values = queryString.parse(this.props.location.search);
            console.log(values.q);
        }



    }

    render() {
        let displaySwitch;
        if (this.props.location.pathname === "/article" ||
            this.props.location.pathname === "/search" ||
            this.props.location.pathname === "/bookmark") {
            displaySwitch = "none";
        } else {
            displaySwitch = "block"
        }

        let displayEmptyBookmark;
        let displayFullBookmark;

        if (this.props.location.pathname === "/bookmark") {
            displayEmptyBookmark = 'none';
            displayFullBookmark = 'block';
        }
        else {
            displayEmptyBookmark = 'block';
            displayFullBookmark = 'none';
        }

        return (
            <>
                <ReactTooltip place='bottom' effect='solid' id='bookmark'/>


                <Navbar collapseOnSelect expand="lg" className="navBar" variant="dark">
                <AsyncSelect
                    className="navBarOption"
                    value={this.state.value}
                    loadOptions={loadSearchResult}
                    placeholder={"Enter keyword .."}
                    noOptionsMessage={() => "No match"}
                    onChange={
                        opt => {
                            if (opt.value !== 'undefined' && opt.value != null) {
                                this.setState({value: opt});
                                this.props.history.push("search?q=" + opt.value)
                            }
                        }
                    }
                />

                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>

                <Navbar.Collapse id="responsive-navbar-nav">

                    <Nav className="mr-auto">
                        <Nav.Link exact activeClassName='active' as={NavLink} to="/">Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/world">World</Nav.Link>
                        <Nav.Link as={NavLink} to="/politics">Politics</Nav.Link>
                        <Nav.Link as={NavLink} to="/business">Business</Nav.Link>
                        <Nav.Link as={NavLink} to="/technology">Technology</Nav.Link>
                        <Nav.Link as={NavLink} to="/sport">Sports</Nav.Link>
                    </Nav>

                    <div style={{display: displayEmptyBookmark}}>
                        <IconContext.Provider value={{color: 'white', size: '1.2em'}}>
                            <div>
                                <FaRegBookmark
                                    data-tip='Bookmark' data-for='bookmark'
                                    onClick={() => this.props.history.push("bookmark")}
                                    style={{marginRight: '15px'}}/>
                            </div>
                        </IconContext.Provider>

                    </div>

                    <div style={{display: displayFullBookmark}}>
                        <IconContext.Provider value={{color: 'white', size: '1.2em'}}>
                            <div>
                                <FaBookmark
                                    data-tip='Bookmark' data-for='bookmark'
                                    onClick={() => this.props.history.push("bookmark")}
                                    style={{marginRight: '15px'}}/>
                            </div>
                        </IconContext.Provider>
                    </div>


                    <span style={{color: 'white', marginRight: '25px', display: displaySwitch}}>
                        NYTimes
                    </span>

                    <div style={{display: displaySwitch, marginRight: '20px'}}>
                        <Switch
                            className="navBarSwitch"
                            checked={this.state.checked}
                            onChange={this.handleChange}
                            onColor={"#2693e6"}
                            offColor={"#dddddd"}
                            onHandleColor={"#ffffff"}
                            offHandleColor={"#ffffff"}
                            handleDiameter={30}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        />
                    </div>

                    <span style={{color: 'white', display: displaySwitch}}>
                        Guardian
                    </span>

                </Navbar.Collapse>
            </Navbar>
                </>
        )
    }
}

export default withRouter(NavBar);