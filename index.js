const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

const REGISTEREDUSERS = [
    {
        username:"Mary"
    },
    {
        username:"Bob"
    },
    {
        username:"Foo"
    }
];

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.get('/users', (req,res)=> {
    res.send(REGISTEREDUSERS);
})

app.post('/signup', (req,res) => {
    //retrieves the username from the http request body
    const { username } = req.body

    //checking if entered username already exists
    let exists = false
    for (let i=0; i<REGISTEREDUSERS.length; i++){
        if (REGISTEREDUSERS[i].username === username){
            exists = true;
            break;
        }
    }

    //If entered username already exists, return an error message
    if (exists){
        res.status(401).send('User already exists');
        return;
    }

    //Adding new username to REGISTEREDUSERS
    REGISTEREDUSERS.push({username});

    console.log(REGISTEREDUSERS);

    res.status(200).send('OK');
})

app.post('/login', (req,res) => {
    //retrieves the username from the http request body
    const {username} = req.body

    //checking if the entered username is valid
    let isValidUser = false
    for(let i=0; i<REGISTEREDUSERS.length; i++){
        if(REGISTEREDUSERS[i].username === username){
            isValidUser = true;
            break;
        }
    }

    //sending status 400 error message if invalid
    if(!isValidUser){
        res.status(401).send('Invalid user, please create a new account');
        return;
    }

    //sending status 200 OK if valid
    res.status(200).send('OK');
})
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })