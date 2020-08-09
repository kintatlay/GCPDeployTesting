require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.MONGO_DB, {useNewUrlParser: true, useUnifiedTopology: true}, (error) => {
    console.log(error);
});

mongoose.connection.on("open", () => {
    console.log("successfully connected");
});

mongoose.connection.on("error", () => {
    console.log("there was an error");
});

const Cat = mongoose.model('Cat', { name: String });

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.post('/api', (req, res) => {
    const body = req.body;
    const kitty = new Cat({ name: body.name });
    kitty.save().then(() => console.log('Cat added to the database'));
})

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

app.listen(process.env.port || 8080, () => {
    console.log('Express app is running on 8080')
});