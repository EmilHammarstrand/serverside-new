
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
/* const fs = require("fs"); */
const port = 3333;
const mdlwareTest = require("./middleware");

/* 
app.use(mdlwareTest)
 */
/* let readStream = fs.createReadStream("/boats.js")
let writeStream = fs.createWriteStream("./src/App.vue")
fs.ReadStream.pipe(writeStream) */

app.use( express.static(__dirname + '/src') )

app.use( bodyParser.urlencoded({ extended: true }) )
app.use( bodyParser.json() )

app.get("/", (req, res)=>{
    console.log(req.url);
    res.send("<p>serverside</p>")
})

/* app.get("/boat", (req, res)=>{ // Om man glömmer S'et på boats så skickas man ändå till boats url:en.
    res.redirect(301, "/boats")
}); */

let boats = [{
    name: "yamaha",
    year: 2003,
    price: 120000,
    sailboat: "no",
    engine: "yes"
},{
    name: "johnson",
    year: 2020,
    price: 420000,
    sailboat: "no",
    engine: "yes"}
];

app.get('/boats', (req, res)=>{  //Skriver ut båtarna
    res.send(boats)
})

/* app.get('/boats', (req, res) => {
    let id = Number(req.query.id)
    res.send( boats[id] )
    console.log(boats[id])
}) */

app.post('/boat', (req, res) => {
    // req.body -> { name, email }
    let newBoat = { name: req.body.name, year: req.body.email };
    boats.push(newBoat);
    console.log(newBoat)
    res.send('New boat added.');
})

app.get('/boats')

app.listen(port, (err)=>{
    if(err){
        console.log("Error har uppstått", err)
        return;
    }
    console.log("Lyssnar på port:", port);
})