const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {log} = require('nodemon/lib/utils');

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

    console.log(req.body);

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

    res.send({});
});

app.listen(4002, () => {
    console.log('listening 4002');
});