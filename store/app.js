//core modules
const path = require('path');

//external module
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

//local module
const storeRouter = require('./routes/storeRouter');
const authRouter = require('./routes/authRouter');
const hostRouter = require('./routes/hostRouter');
const errorController = require('./controller/errorController');
const rootdir = require('./utils/pathutils');

const PATH = "mongodb://mongodb:mongodb01@ac-dghizuz-shard-00-00.8ubrtoz.mongodb.net:27017,ac-dghizuz-shard-00-01.8ubrtoz.mongodb.net:27017,ac-dghizuz-shard-00-02.8ubrtoz.mongodb.net:27017/Furni?ssl=true&replicaSet=atlas-11m6yn-shard-0&authSource=admin&appName=NodeJs"

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({extended :true}));
app.use(express.json());

app.use((req, res, next) => {
    res.locals.query = req.query;
    next();
});

const store = new MongoDBStore({
    uri : PATH,
    collection : 'sessions',
});

app.use(session({
    secret : 'furni.',
    resave : true,
    saveUninitialized : false,
    store,
    cookie: { maxAge: 2 * 60 * 60 * 1000 }, // 2 hours
}));

app.use( (req, res, next) => {
    req.isLoggedIn = req.session.isLoggedIn;
    req.user = req.session.user;
    next();
});



app.use(storeRouter);
app.use('/host',hostRouter);
app.use(authRouter);

app.use(express.static(path.join(rootdir, 'public')));

app.use(errorController.error404);

const PORT = 5000;



mongoose.connect(PATH).then( () => {
    console.log("connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server Started on address http://localhost:${PORT}`);
    });
}).catch( (err) => {
    console.log("error while connected to MongoDb", err);
});


