const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ehoamog.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run() {
    try {
        const taskCollection = client.db('task-me').collection('my-task');
        const userCollection = client.db('task-me').collection('users');
        const completedTaskCollection = client.db('task-me').collection('completed');

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.get('/my-task', async (req, res) => {
            const query = {};
            const tasks = await taskCollection.find(query).toArray();
            res.send(tasks);
        })
        app.get('/my-task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await taskCollection.findOne(filter);
            res.send(result);
        })

        app.post('/my-task', async (req, res) => {
            const task = req.body;
            console.log(task)
            const result = await taskCollection.insertOne(task);
            res.send(result);
        })



        app.post('/my-task/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const tasks = req.body;
            console.log(tasks);


            const updatedTask = {
                $set: {

                    task: tasks.task,

                }
            }

            const result = await taskCollection.updateOne(query, updatedTask);
            return res.send(result);

        })




        app.delete('/my-task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };

            const result = await taskCollection.deleteOne(filter);
            res.send(result);
        })


        app.post('/completed', async (req, res) => {
            const completedTask = req.body;
            const result = await completedTaskCollection.insertOne(completedTask);
            res.send(result);
        })


        app.get('/completed', async (req, res) => {
            const query = {};
            const tasks = await completedTaskCollection.find(query).toArray();
            res.send(tasks);
        })
        app.get('/completed/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await completedTaskCollection.findOne(filter);
            res.send(result);
        })

        app.delete('/completed/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: ObjectId(id) };
            console.log(filter);
            const result = await completedTaskCollection.deleteOne(filter);
            res.send(result);
        })

        app.post('/completed/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const comments = req.body;
            console.log(comments);


            const updatedComment = {
                $set: {

                    comments,

                }
            }

            const result = await completedTaskCollection.updateOne(query, updatedComment);
            return res.send(result);

        })

    }



    finally {

    }
}
run().catch(console.log)

app.get('/', async (req, res) => {
    res.send('task me server is running')
})

app.listen(port, () => console.log('task me is running on port', port))