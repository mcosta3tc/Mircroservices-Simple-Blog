import React, {useState, useEffect} from "react";
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

export default () => {
    /**
     * {} in useState => post MS return an {} in the res.send
     */
    const [posts, setPosts] = useState({});


    const fetchPosts = async () => {
        /**
         * posts <== Query Service
         * axios resp => data{}
         */
        const res =  await axios.get('http://localhost:4002/posts');
        setPosts(res.data);
    }

    /**
     * triggered at the launch of the component
     * [] => run this fn 1x
     */
    useEffect(()=>{
        fetchPosts()
    }, [])

    /**
     * Object.values = [] of all posts
     * map [posts] && foreach post => generate jsx
     * <== posts <== fetchPost() <== Query Service
     */
    const renderedPost = Object.values(posts).map(post => {
        return (
                /**
                 * key = {} :
                 *  - posts => generated list of elements
                 *  - react expect a unique key property on each element created
                 *  - this key => id of the post
                 */
                <div className="card" style={{width: '30%', marginBottom: '20px'}} key={post.postId}>
                    <div className='card-body'>
                        <h3>{post.title}</h3>
                        {/**
                         comments <== post <== fetchPost() <== Query Service
                         */}
                        <CommentList comments={post.comments}/>

                        <CommentCreate postId={post.postId} />
                    </div>
                </div>
        )
    })

    /**
     * rendering the posts
     */
    return(
            <div className='d-flex flex-row flex-wrap justify-content-between'>
                {renderedPost}
            </div>
    )
}