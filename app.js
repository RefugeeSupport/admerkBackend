require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Multer = require("multer");
const path = require("path");
const defaultPath = "./public/uploads";

const routes = require('./routes')
const port = process.env.PORT

let db = require("./knexfile");
global.knex = require("knex")(db[process.env.NODE_ENV]);

const app = express();

let storage = Multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, defaultPath);
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + "-" + file.originalname);
    },
});
let upload = Multer({ storage: storage });
app.use(upload.any());

app.use(cors())

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log(new Date(), req.path)
    next();
})
app.use('/api', routes)

app.use(express.static('build'));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});

app.listen(port,() => {
    console.log('port is up on ' + port)
})
