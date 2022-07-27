const express = require('express');
const fs  = require('fs');
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../fsUtils');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname, "./index.html"))
})
app.get("/notes",(req,res)=>{
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})

app.get("/api/notes",(req, res)=>{
    fs.readFile("./db/db.json", "utf-8", (err, data)=>{if (err) {
        console.log(err)
        
    } else {
        const processData = JSON.parse(data)
        res.json(processData)
    }})
})

app.post("/api/notes", (req, res)=> {
    const {title, text} = req.body;
    if(title && text){
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };
        readAndAppend(newNote, './db/db.json');
        res.json("success!")
    } else {
        res.json("error!")
    }
   

});








app.listen(PORT, ()=>{
    console.log("listening on" + PORT)
})