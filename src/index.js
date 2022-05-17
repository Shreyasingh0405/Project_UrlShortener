const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const moment = require('moment');
const { default: mongoose } = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://Project2_GroupNo_103:Project2_GroupNo_103@cluster0.dwdte.mongodb.net/groupXdatabase", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use(
    function (req,res,next){
        console.log(moment().format('YYYY-MM-DD HH:MM:SS'),',',req.ip,',',req.method,',',req.path);
        next();

    }
);
    
app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});