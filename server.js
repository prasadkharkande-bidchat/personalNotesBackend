require("dotenv").config()
const express = require("express");
const jwt = require("jsonwebtoken")
const users = require("./routes/users");
const notes = require("./routes/notes");

const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json())

app.get('/', (req, res) => {
    res.send("Server is ready");
})

app.post('/login', (req, res)=> {
    //Authenticate User
    const username = req.body.username;
    const user = {
        name: username,
    }
    jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

});

app.use('/api/v1/users', users);
app.use('/api/v1/notes', notes);

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`)
})