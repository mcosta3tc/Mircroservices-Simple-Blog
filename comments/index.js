const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {}

app.get('/posts/:id/comments', ((req, res) => {
    res.send(commentsByPostId[req.params.id]);
}));

app.post('/posts/:id/comments', ((req, res) => {
    //Generating random id by bytes and converted to hex string
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    /**
     * check if we already have an array in => {commentsByPostId} or the post id
     * => comments or undefined, if so => []
     */
    const comments = commentsByPostId[req.params.id] || [];

    /**
     * push-in
     *  - generated id
     *  - content from req.body
     */
    comments.push( { id: commentId, content: content });

    /**
     * assign => commentsByPostId ; comments
     */
    commentsByPostId[req.params.id] = comments;

    res.status(201).send(comments);
}));

app.listen(4001, () => {
    console.log('listening on 4001');
});