#Server for Task-Tracker

Currently contains the following APIs

2. POST /signup
send {"username":"Bob"} in the http request.
Returns a array of JSON task objects
[
    {
        "username": "Bob",
        "task_id": 0,
        "title": "Learn React",
        "description": "Finish coursera section 1 on React.js",
        "status": "Not Started",
        "due_date": "2023-04-20T00:00:00.000Z"
    },
    {
        "username": "Bob",
        "task_id": 0,
        "title": "Laundry",
        "description": "Finish Laundry",
        "status": "Not Started",
        "due_date": "2023-04-17T00:00:00.000Z"
    }
]

3. GET /
returns 'Hello World!'

4. GET /users
returns JSON array of all registered users
