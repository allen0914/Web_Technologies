import React from 'react';
import commentBox from 'commentbox.io';

class CommentBoxCard extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.removeCommentBox = commentBox('5753310338351104-proj');
    }

    componentWillUnmount() {
        this.removeCommentBox();
    }

    render() {
        return (
            <div className="commentbox" id={this.props.id}/>
        );
    }
}
export default CommentBoxCard;