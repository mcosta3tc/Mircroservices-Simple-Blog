const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    /*
 * req ==> event properties from EventBus (Broker)
 *  - type
 *  - {data}
 */
    const {type, data} = req.body;

    if(type === 'CommentCreated') {
        /**
         * Approve or reject comment
         * - status :
         *      - check if orange is the content of the comment
         *      - true status = rejected
         *      - false status = approved
         */
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        /**
         * Event emitted => event bus
         * with the updated status
         */
        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                commentId: data.commentId,
                content: data.content,
                postId: data.postId,
                status
            }
        });
    }

    res.send({});
});

app.listen(4003, () => {
    console.log('listen on 4003');
});