//core modules
const path = require('path');

//external module
const express = require('express');

//local module
const storeRouter = require('./routes/storeRouter');
const rootdir = require('./utils/pathutils');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(storeRouter);

app.use(express.static(path.join(rootdir, 'public')));

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server Started on address http://localhost:${PORT}`);
});
