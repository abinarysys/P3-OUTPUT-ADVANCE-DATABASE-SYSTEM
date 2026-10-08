const mysql2 = require('mysql2')

const conn = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'omivader1617',
    database: 'schoolserver'
});

conn.connect((err) =>{
    if (err){
        console.log("DB failed: ", (err))
    }else{
        console.log("DB connected")
    }
});

module.exports = conn;