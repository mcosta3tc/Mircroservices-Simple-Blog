const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id]);
});

app.post('/posts/:id/comments', async (req, res) => {
    //Generating random id by bytes and converted to hex string
    const commentId = randomBytes(4).toString('hex');
    const {content} = req.body;
    const postId = req.params.id;

    /**
     * check if we already have an array in => {commentsByPostId} or the post id
     * => comments or undefined, if so => []
     */
    const comments = commentsByPostId[postId] || [];

    /**
     * ==> this.commentsByPostId{}
     *  - generated id
     *  - content from req.body
     *  - status moderation (default) : pending => UX : queryService => always show the status moderation, after user refresh the page
     */
    comments.push({commentId: commentId, content: content, status: 'pending'});

    /**
     * assign => commentsByPostId ; comments
     */
    commentsByPostId[postId] = comments;

    /**
     * Event emitted => event bus
     */
    await axios.post('http://event-bus-service:4005/events', {
        type: 'CommentCreated',
        data: {
            commentId,
            content,
            postId: postId,
            status: 'pending'
        }
    });


    res.status(201).send(comments);
});

/**
 * Receive any event from EventBus
 */
app.post('/events', async (req, res) => {
    console.log('Event received : ', req.body.type);

    /**
     * Received from the body
     */
    const {type, data} = req.body;

    if(type === 'CommentModerated') {
        /**
         * found the actual comment
         * stored in commentsByPostId{}
         * from data
         */
        const {postId, commentId, content, status} = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find((comment) => {
            //find the comment with the id === event => comment => commentId
            return comment.commentId === commentId;
        });
        //update the founded comment, status
        comment.status = status;

        /**
         * Send the updated comment => EventBus
         * shorthand => data : obj already received from req.body
         */
        await axios.post('http://event-bus-service:4005/events', {
            type: 'CommentUpdated',
            data: {
                commentId,
                postId,
                content,
                status
            }
        }).catch(function (error) {
            console.log(error);
        });


    }

    res.send({status: 'ok'});
});

app.listen(4001, () => {
    console.log('listening on 4001');
});