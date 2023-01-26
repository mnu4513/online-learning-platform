const express = require('express');
const app = express();
app.use(express.json());

const dotenv = require('dotenv').config();
// const PORT
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect("mongodb+srv://mnu4513:monu8181@firstcluster.daae6aq.mongodb.net/bonus4", {useNewUrlParser: true})
.then(() => console.log('mongoDB is connected'))
.catch((err) => console.log(err));

const route = require('./routes/route');
app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('server is listening on port ' + 3000)
});