const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
const app = express();

app.use(cors());
//Import Routes
const authRoute = require('./routes/auth');
const workoutsRoute = require('./routes/workouts');
const workoutsDaysRoute = require('./routes/workoutDays');

//Middleware
app.use(bodyParser.json());

//Routes

app.use('/api/workouts', workoutsRoute);
app.use('/api/workoutDays', workoutsDaysRoute);
app.use('/api/user', authRoute);

mongoose.connect(process.env.DB_CONNECTION, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },(err)=>{
    if(!err){
         console.log('MongoDB connection sucess');
        }
    else{ 
        console.log('connection not established :' + JSON.stringify(err,undefined,2));
    }
});



app.listen(3000);