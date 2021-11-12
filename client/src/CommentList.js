import React from 'react';

export default ({comments}) => {

    /**
     * Object.values = [] of all comments
     * map [comments] && foreach comment => generate jsx
     */
    const renderedComments = comments.map(comment => {
        return (
                /**
                 * key = {} :
                 *  - comments => generated list of elements
                 *  - react expect a unique key property on each element created
                 *  - this key => id of the comment
                 */
                <li key={comment.commentId}>{comment.content}</li>
        )
    })

    /**
     * rendering the comments
     */
    return (
           <ul>
               {renderedComments}
           </ul>
    )
}