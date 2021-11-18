import React, {useState} from 'react';
import axios from 'axios';

/**
 * Each Time a Post created from PostList Component, create a Comment
 *  - pass the id of the post => props
 *  - destructured obj ({postId}) => x1 property expected
 */
const CommentCreated = ({postId}) => {
    /**
     * Track the content of the input
     */
    const [content, setContent] = useState('');

    /**
     * === Form submission => receive event => prevent Default
     */
    const onsubmit = async (event) => {
        event.preventDefault();
        // ? => k8s ==> Ingress Controller (posts.com)
        await axios.post(`http://posts.com/posts/${postId}/comments`, {
            content
        });
        /**
         * reset the value of the input after submit
         */
        setContent('');
    };


    return (
            <div>
                <form onSubmit={onsubmit}>
                    <div className="form-group mb-3">
                        <label className="form-label">New Comment</label>
                        {/**
                         When user change the input => event => update state of content
                         */}
                        <input value={content} onChange={event => setContent(event.target.value)}
                               className="form-control"/>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>
            </div>
    );
};

export default CommentCreated;