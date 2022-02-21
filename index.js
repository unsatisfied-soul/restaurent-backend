const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const app = express()
require('dotenv').config()
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h6wi6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect()
        const restaurentMenu = client.db('restaurente').collection('restaurentMenu')

        const users = client.db('restaurente').collection('users')

        //menu item

        app.post('/menu', async(req,res)=> {
            const order = req.body;
            const result = await restaurentMenu.insertOne(order)
            res.send(result)
        })

        app.get('/menu', async(req,res)=> {
            const cursor = restaurentMenu.find({})
            const result = await cursor.toArray();
            res.send(result)
        })
        
        //registerusers

        app.post('/users',async(req,res)=> {
            const hashedPassword = await bcrypt.hash(req.body.userPassword,10)
            const order = {
                name: req.body.userName,
                email: req.body.userEmail,
                password: hashedPassword
            };
            const result = await users.insertOne(order)
            res.send(result)
        })

        //loginuser
        app.post('/login', async(req,res)=> {
            const user = await users.findOne({
                email: req.body.email
            })
            if(user){
                // const token = jwt.sign({
                //     email: user.email
                // }, process.env.JWT_SECRET)
                return res.json({email: user.email, status: process.env.JWT_SECRET})
            }else{
                return res.json({status: 'error'})
            }
        })

    }
    catch(error){}
    finally{}
}

run().catch(console.dir())

app.get('/',(req,res)=> {
    res.send(`it's Restaurante Backend`)
})

app.listen(port,()=> {
    console.log(`listen to port`, port)
})