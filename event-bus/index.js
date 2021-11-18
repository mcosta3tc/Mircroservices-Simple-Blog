const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

/**
 * stores incoming events
 *  most recent at the end
 */
const events = [];

/**
 * Post handler => foreach event:
 *  - request to the different services servers
 */
app.post('/events', (req, res) => {
    /**
     * event = the body of request, of any kind (json, string, obj...)
     * event => Services
     */
    const event = req.body;

    //store event
    events.push(event);

    console.log(event);

    //Posts
    axios.post('http://posts-clusterip-service:4000/events', event).catch((err) => {
        console.log(err.message);
    });

    //Comments
    axios.post('http://comments-service:4001/events', event).catch((err) => {
        console.log(err.message);
    });

    //Query
    axios.post('http://query-service:4002/events', event).catch((err) => {
        console.log(err.message);
    });

    //Moderation
    axios.post('http://moderation-service:4003/events', event).catch((err) => {
        console.log(err.message);
    });

    /**
     * foreach committed event send ok => worked
     */
    res.send({status: 'OK'});
});

/**
 * retrieve all the event, ever occurred
 */
app.get('/events', (req, res) => {
    res.send(events);
});

app.listen(4005, () => {
    console.log('v3');
    console.log('listening 4005');
});

