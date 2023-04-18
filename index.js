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
        const userTasks = TASKSLIST.filter(task => task.username === username);
        res.status(200).send(userTasks);
        return;
    }

    //Adding new username to REGISTEREDUSERS
    REGISTEREDUSERS.push({username});

    console.log(REGISTEREDUSERS);

    res.status(200).send('OK');
})

app.post('/task', (req,res) => {
    const {username, title, description, status, due_date} = req.body;
    const t_id = TASKSLIST.length;

    TASKSLIST.push(
        {
            username: username,
            task_id: t_id,
            title: title,
            description: description,
            status: status,
            due_date: due_date
        }
    )

    res.status(200).send(TASKSLIST.filter(task => task.username === username));
})

app.put('/task', (req,res) => {
    const {username, task_id, title, description, status, due_date} = req.body;

    TASKSLIST[task_id] = {
        username:username,
        task_id:task_id,
        title:title,
        description:description,
        status:status,
        due_date: new Date(due_date)
    }

    res.status(200).send(TASKSLIST.filter(task => task.username === username));
})

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