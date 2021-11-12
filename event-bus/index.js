const express= require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

/**
 * Post handler => foreach event:
 *  - request to the different services servers
 */
app.post('/events', (req, res) => {
    /**
     * event = the body of request, of any kind (json, string, obj...)
     * event => Services
     */
    const events = req.body;

    //Posts
    axios.post('http://localhost:4000/events', events);

    //Comments
    axios.post('http://localhost:4001/events', events);

    //Query
    axios.post('http://localhost:4002/events', events);

    /**
     * foreach committed event send ok => worked
     */
    res.send({status:'OK'});
});

app.listen(4005, ()=>{
    console.log('listening 4005');
})

