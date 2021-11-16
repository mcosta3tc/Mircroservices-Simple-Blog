const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

/**
 *
 * @type {{
 *     '1234':{
 *        'postId': '1234',
 *        'title': 'the title',
 *        'comments' : [
 *            {
 *                'commentId' : '1542',
 *                'content' : 'the comment'
 *            }
 *        ]
 *     }
 * }}
 */
const posts = {};

/**
 * helper fn => handle the incoming events
 */
const handleEvent = (type, data) => {

    //Event : Post created
    if(type === 'PostCreated') {
        //{post}
        const {postId, title} = data;

        /**
         * update this.posts with data
         */
        posts[postId] = {
            postId, title, comments: []
        };
    }

    if(type === 'CommentCreated') {
        //{comment}
        const {commentId, content, postId, status} = data;

        //post <== {posts}
        const post = posts[postId];

        //comment => the post
        post.comments.push({commentId, content, status});
    }

    if(type === 'CommentUpdated') {
        /**
         * Find the comment from posts{}
         */
        const {commentId, postId, content, status} = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => {
            return comment.commentId === commentId;
        });

        /**
         * update the comment properties <== data
         */
        comment.status = status;
        comment.content = content;
    }

};

//<== posts{}
app.get('/posts', (req, res) => {
    res.send(posts);
});

/**
 * Endpoint <== EventBus
 * ==> post and his comment
 */
app.post('/events', (req, res) => {
    /*
     * req ==> event properties from EventBus (Broker)
     *  - type
     *  - {data}
     */
    const {type, data} = req.body;

    //call the helper handler
    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log('listening 4002');

    try {
        /**
         * on start query service : req => eventBus
         *  - => list events that have been emitted at this point in time
         */
        const res = await axios.get('http://localhost:4005/events');

        /**
         * interring over events
         */
        for(let event of res.data) {
            console.log('Processing event : ', event.type);

            handleEvent(event.type, event.data);
        }
    } catch(error) {
        console.log(error.message);
    }
});