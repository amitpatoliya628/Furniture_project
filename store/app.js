//core modules
const path = require('path');

//external module
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const multer = require('multer');

//local module
const storeRouter = require('./routes/storeRouter');
const authRouter = require('./routes/authRouter');
const hostRouter = require('./routes/hostRouter');
const errorController = require('./controller/errorController');
const rootdir = require('./utils/pathutils');

const PATH = "mongodb://mongodb:mongodb01@ac-dghizuz-shard-00-00.8ubrtoz.mongodb.net:27017,ac-dghizuz-shard-00-01.8ubrtoz.mongodb.net:27017,ac-dghizuz-shard-00-02.8ubrtoz.mongodb.net:27017/Furni?ssl=true&replicaSet=atlas-11m6yn-shard-0&authSource=admin&appName=NodeJs"

const app = express();

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
    req.isHost = req.session.isHost;
    req.isLoggedIn = req.session.isLoggedIn;
    req.user = req.session.user;
    req.userId = req.session.user ? req.session.user._id : null;
    next();
});

const randomString = (length) => {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename : (req, file, cb) => {
        cb(null, randomString(10) +'-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const multerOptions = {
    storage,
    fileFilter,
}



app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.urlencoded({extended :true}));
app.use(multer(multerOptions).single('image'));
app.use(express.static(path.join(rootdir, 'public')));
app.use('/uploads', express.static(path.join(rootdir, 'uploads')));
app.use(express.json());


app.use(storeRouter);
app.use('/host',hostRouter);
app.use(authRouter);


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


