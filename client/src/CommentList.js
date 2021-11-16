import React from 'react';

export default ({comments}) => {

    /**
     * Object.values = [] of all comments
     * map [comments] && foreach comment => generate jsx
     */
    const renderedComments = comments.map(comment => {
        /**
         * check comment status
         *  - approved
         *  - rejected
         *  default : pending
         *  => change the content of the comment
         */
        let content;

        switch(comment.status) {
            case 'approved' :
                content = comment.content;
                break;
            case 'rejected' :
                content = 'this comment has been rejected';
                break;
            default:
                content = 'this comment is awaiting moderation';
        }

        return (
                /**
                 * key = {} :
                 *  - comments => generated list of elements
                 *  - react expect a unique key property on each element created
                 *  - this key => id of the comment
                 *  - show verified content
                 */
                <li key={comment.commentId}>{content}</li>
        );
    });

    /**
     * rendering the comments
     */
    return (
            <ul>
                {renderedComments}
            </ul>
    );
}