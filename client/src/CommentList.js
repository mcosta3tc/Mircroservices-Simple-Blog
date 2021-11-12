import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default ({postId}) => {
    /**
     * [] in useState => comment MS return an {} in the res.send
     */
    const [comments, setComments] = useState([]);

    const fetchComments = async () => {
        const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`)

        setComments(res.data)
    }

    useEffect(()=> {
        fetchComments()
    }, []);

    /**
     * Object.values = [] of all comments
     * map [comments] && foreach comment => generate jsx
     */
    const renderedComments = Object.values(comments).map(comment => {
        return (
                /**
                 * key = {} :
                 *  - comments => generated list of elements
                 *  - react expect a unique key property on each element created
                 *  - this key => id of the comment
                 */
                <li key={comment.id}>{comment.content}</li>
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