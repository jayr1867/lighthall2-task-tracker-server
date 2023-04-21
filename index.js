require('dotenv').config();

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const schema = require('./models/schema');
const ObjectId = require('mongoose').Types.ObjectId;
const uri = process.env.URI;

const app = express();
const port = 4000;

mongoose.connect(uri, {
    useNewUrlParser: true
  }).then((conn) => {
    console.log("CONNECTED!");
  }).catch((err) => {
    console.log(err);
  })


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.get('/users', (req,res)=> {
    res.send(REGISTEREDUSERS);
})

app.post('/signup', async (req,res) => {
    //retrieves the username from the http request body
    const { username } = req.body;

    //retrieving list of REGISTEREDUSERS from users.json
    REGISTEREDUSERS = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));

    //checking if entered username already exists
    let exists = REGISTEREDUSERS.some(user => user.username === username);

    //If entered username already exists, return the tasks of that user from the db
    if (exists){

        try {
            /* returning an array of tasks */
            const user_tasks = await schema.find({username: username});

            res.status(200).json(user_tasks);
        } catch(err) {
            res.status(400).json({message: err.message});
        }
        return;
    }

    //else add new user to the users.json file and reutrn an empty array

    //Adding new username to REGISTEREDUSERS
    REGISTEREDUSERS.push({username});

    fs.writeFileSync('./users.json', JSON.stringify(REGISTEREDUSERS));

    res.status(200).send([]);
})

app.post('/task', async (req,res) => {
    const {username, title, description, status, due_date} = req.body;

    const new_task = new schema({
        username: username,
        // task_id: temp_id,
        title: title,
        description: description,
        status: status,
        due_date: new Date(due_date)
    });

    try {
        const user_task = await new_task.save();
        res.status(201).json({"_id": user_task._id});
    } catch(err) {
        res.status(400).json({message: err.message});
    }

})

app.put('/task', async (req,res) => {

    const id = new ObjectId(req.body._id);
    const uname = req.body.username;
    const ttl = req.body.title;
    const desc = req.body.description;
    const sts = req.body.status;
    const date = new Date(req.body.due_date);

    try {
        const task_update = await schema.updateOne(
          {_id: id},
          {$set: {
            username: uname,
            title: ttl,
            description: desc,
            status: sts,
            due_date: date
          }})
      
          const cur_user = await schema.find({username: uname});
          
          res.status(200).json(cur_user);
        } catch(err) {
          res.status(500).json({message: err.message});
        }
})


app.delete('/task', async (req,res) => {
    const id = new ObjectId(req.body._id);

    try {
        const task_delete = await schema.deleteOne({_id: id});
        // console.log(task_delete);
        res.status(200).json({message: "Task deleted successfully"});
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});
  

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })