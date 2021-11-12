const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json())

/**
 *
 * @type {{
 *     '1234':{
 *        'postId': '1234',
 *        'title': 'the title',
 *        'comments' : [
 *            {
 *                'id' : '1542',
 *                'content' : 'the comment'
 *            }
 *        ]
 *     }
 * }}
 */
const posts = {}

//<== posts{}
app.get('/posts', (req, res) => {
    res.send(posts);
})

/**
 * Endpoint <== EventBus
 * ==> post and his comment
 */
app.post('/events', (req, res) => {
    console.log(req.body);
    /*
     * req ==> event properties
     *  - type
     *  - {data}
     */
    const {type , data} = req.body;

    //Event : Post created
    if(type === 'PostCreated'){
        //{post}
        const {postId, title} = data;

        posts[postId] = {
            postId, title, comments : []
        }
    }

    if(type === 'CommentCreated'){
        //{comment}
        const {commentId, content, postId} = data;

        //post <== {posts}
        const post = posts[postId];

        //comment => the post
        post.comments.push({commentId, content})
    }

    console.log('Posts : ', posts);

    res.send({})
})

app.listen(4002, ()=> {
    console.log('listening 4002');
})