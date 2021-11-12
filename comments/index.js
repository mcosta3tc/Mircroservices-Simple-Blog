const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id]);
});

app.post('/posts/:id/comments',  async (req, res) => {
    //Generating random id by bytes and converted to hex string
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const postId = req.params.id;

    /**
     * check if we already have an array in => {commentsByPostId} or the post id
     * => comments or undefined, if so => []
     */
    const comments = commentsByPostId[postId] || [];

    /**
     * push-in
     *  - generated id
     *  - content from req.body
     */
    comments.push( { id: commentId, content: content });

    /**
     * assign => commentsByPostId ; comments
     */
    commentsByPostId[postId] = comments;

    /**
     * Event emitted => event bus
     */
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            commentId,
            content,
            postId: postId
        }
    })



    res.status(201).send(comments);
});

/**
 * Receive any event from EventBus
 */
app.post('/events', (req, res) => {
    console.log('Event received : ', req.body.type);
    res.send({status:'ok'});
})

app.listen(4001, () => {
    console.log('listening on 4001');
});