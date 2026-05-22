//core modules
const path = require('path');

//external module
const express = require('express');
const mongoose = require('mongoose');

//local module
const storeRouter = require('./routes/storeRouter');
const authRouter = require('./routes/authRouter');
const hostRouter = require('./routes/hostRouter');
const errorController = require('./controller/errorController');
const rootdir = require('./utils/pathutils');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({extended :true}));
app.use(express.json());

app.use(storeRouter);
app.use(authRouter);
app.use(hostRouter);

app.use(express.static(path.join(rootdir, 'public')));

app.use(errorController.error404);

const PORT = 5000;

const PATH = "mongodb://mongodb:mongodb01@ac-dghizuz-shard-00-00.8ubrtoz.mongodb.net:27017,ac-dghizuz-shard-00-01.8ubrtoz.mongodb.net:27017,ac-dghizuz-shard-00-02.8ubrtoz.mongodb.net:27017/Furni?ssl=true&replicaSet=atlas-11m6yn-shard-0&authSource=admin&appName=NodeJs"

mongoose.connect(PATH).then( () => {
    console.log("connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server Started on address http://localhost:${PORT}`);
    });
}).catch( (err) => {
    console.log("error while connected to MongoDb", err);
});


