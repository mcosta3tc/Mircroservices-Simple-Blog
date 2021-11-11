const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');

const app = express();
app.use(bodyParser.json());

const posts = {};

app.get('/posts', ((req, res) => {
    res.send(posts);
}));

app.post('/posts', ((req, res) => {
    const postId = randomBytes(4).toString('hex');
    const {title} = req.body;

    posts[postId] = {
        id: postId,title
    }

    res.status(201).send(posts[postId]);
}));

app.listen(4000, () => {
    console.log('listening on 4000')
});