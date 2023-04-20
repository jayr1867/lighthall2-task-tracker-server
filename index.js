require('dotenv').config();

const express = require('express');
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

const TASKSLIST = [
    {
        username:"Mary",
        task_id: 0,
        title: "Grocery shopping",
        description: "Buy Bread, Eggs, and Milk",
        status:"Not Started",
        due_date: new Date('2023-04-17')
    },
    {
        username:"Mary",
        task_id: 1,
        title: "Bake Cake",
        description: "Bake a chocolate cake",
        status:"Not Started",
        due_date: new Date('2023-04-19')
    },
    {
        username:"Bob",
        task_id: 2,
        title: "Learn React",
        description: "Finish coursera section 1 on React.js",
        status:"Not Started",
        due_date: new Date('2023-04-20')
    },
    {
        username:"Bob",
        task_id: 3,
        title: "Laundry",
        description: "Finish Laundry",
        status:"Not Started",
        due_date: new Date('2023-04-17')
    },
    {
        username:"Foo",
        task_id: 4,
        title: "Work on thesis report",
        description: "Finish section 2",
        status:"Not Started",
        due_date: new Date('2023-04-21')
    },
]

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.get('/users', (req,res)=> {
    res.send(REGISTEREDUSERS);
})

app.post('/signup', async (req,res) => {
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
        // const userTasks = TASKSLIST.filter(task => task.username === username);
        // res.status(200).send(userTasks);

        try {
            /* returning the an array of tasks */
            const user_tasks = await schema.find({username: username});

            res.status(200).json(user_tasks);
        } catch(err) {
            res.status(400).json({message: err.message});
        }
        return;
    }

    //Adding new username to REGISTEREDUSERS
    REGISTEREDUSERS.push({username});

    console.log(REGISTEREDUSERS);

    res.status(200).send('OK');
})

app.post('/task', async (req,res) => {
    const {username, title, description, status, due_date} = req.body;
    // const t_id = TASKSLIST.length;

    // TASKSLIST.push(
    //     {
    //         username: username,
    //         task_id: t_id,
    //         title: title,
    //         description: description,
    //         status: status,
    //         due_date: due_date
    //     }
    // )

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


    // res.status(200).send(TASKSLIST.filter(task => task.username === username));
})

app.put('/task', async (req,res) => {
    // const {username, task_id, title, description, status, due_date} = req.body;

    // TASKSLIST[task_id] = {
    //     username:username,
    //     task_id:task_id,
    //     title:title,
    //     description:description,
    //     status:status,
    //     due_date: new Date(due_date)
    // }

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

    // res.status(200).send(TASKSLIST.filter(task => task.username === username));
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

// app.post('/login', (req,res) => {
//     //retrieves the username from the http request body
//     const {username} = req.body

//     //checking if the entered username is valid
//     let isValidUser = false
//     for(let i=0; i<REGISTEREDUSERS.length; i++){
//         if(REGISTEREDUSERS[i].username === username){
//             isValidUser = true;
//             break;
//         }
//     }

//     //sending status 400 error message if invalid
//     if(!isValidUser){
//         res.status(401).send('Invalid user, please create a new account');
//         return;
//     }

//     //sending status 200 OK if valid
//     res.status(200).send('OK');
// })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })