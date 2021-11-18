const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', ((req, res) => {
    res.send(posts);
}));

app.post('/posts', (async (req, res) => {
    const postId = randomBytes(4).toString('hex');
    const {title} = req.body;

    posts[postId] = {
        postId, title
    };

    /**
     * Event emitted => event bus
     * Reaching K8s pod by his service name and port
     */
    await axios.post('http://event-bus-service:4005/events', {
        type: 'PostCreated',
        data: {
            postId,
            title
        }
    });

    res.status(201).send(posts[postId]);
}));

/**
 * Receive any event from EventBus
 */
app.post('/events', (req, res) => {
    console.log('Received event : ', req.body.type);
    res.send({status: 'Ok'});
});

app.listen(4000, () => {
    console.log('v2');
    console.log('listening on 4000');
});