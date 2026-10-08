const session = require('express-session')
const conn = require('./conn.js')
const express = require('express')
const crypto = require('crypto')

const app = express();

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}))

app.get("/", (req,res) => {
    res.render("index")
})

app.post("/register", (req,res) => {
   console.log(req.body);
   const {un, pw} = req.body;
   const password = crypto.createHash("sha256").update(pw).digest("hex")
   const insertUser = `INSERT INTO users (username, password) VALUES (?, ?)`;
   conn.query(insertUser, [un, password], (err,result) =>{
    if (err){
        console.log("Error, registration failed: ", err);
        res.send("Error, reigstration failed: ", err.message)
    }else{
        res.redirect("/login")
    }
    })
})

app.get("/login", (req,res) =>{
    res.render('login')
})

app.post("/loginUser", (req,res) =>{
    const {un,pw} = req.body;
    const password = crypto.createHash("sha256").update(pw).digest("hex");
    const loginUser = `SELECT * FROM users WHERE username = ? AND password = ?`;
    conn.query(loginUser, [un, password], (err,result) =>{
        if(err){
            console.log("Login Failed: ", err);
            res.send("Login Failed: ", err.message);
        }
        if (result.length>0){
            console.log("Login Successful!")
            req.session.user = {
                id: result[0].user_id,
                username: result[0].username
            }
            res.redirect("/home")
        }
    })
})

app.get("/logout", (req,res) =>{
    req.session.destroy((err) =>{
        if(err){
            console.log("Log out failed")
        }else{
            res.redirect("/")
        }
    })
})

app.get("/home", (req,res) =>{
    if(!req.session.user){
        res.redirect("/login")
    }
    const username = req.session.user.username;
    res.render('home', {username:username})
})

app.listen(4000)