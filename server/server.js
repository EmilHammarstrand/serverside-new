const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 2001;
const { getAllBoats, addBoat, clearDatabase, deleteBoat, getBoatById, searchInput } = require('./database');

app.use( (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
})

app.use( express.static(__dirname + '/../frontend') )
app.use( bodyParser.urlencoded({ extended: true }) )
app.use( bodyParser.json() )

app.get("/", (req, res)=>{
    console.log(req.url);
})


app.get('/boats', (req, res) => {  //Hämtar alla båtar i databasen.
    console.log('Hämtar båtarna från databasen, funkar det?...')
    getAllBoats(dataOrError => {
        res.send(dataOrError)
        console.log('Båtarna hämtades!')
    })
})

app.get('/boat', (req, res) => { // Hämta en båt med specifikt id.
    let id = req.query.id;
    getBoatById(id, dataOrError => {
        res.send(dataOrError)
    })
})

app.delete('/boat', (req, res) => { // Ta bort båtdokument med hjälp av ID't.
    let id = req.query.id;
    deleteBoat(id, dataOrError => {
        res.send(dataOrError)
    })
})

app.post('/boat', (req, res) => { // Lägg till båtdokument i databasen.
    addBoat(req.body, dataOrError => {
        res.send(dataOrError)
    })
})

app.get('/search', (req, res)=>{ //Sök efter maxpris
   
    searchInput(req.query, dataOrError => {
       res.send(dataOrError) 
    })
})

app.post('/clearDatabase', (req, res) => { // Rensa databasen på dokument så det inte blir så många.
    clearDatabase(req.body, dataOrError => {
        res.send(dataOrError);
    })
})

app.listen(port, (err)=>{
    if(err){
        console.log("Error har uppstått", err)
        return;
    }
    console.log("Lyssnar på port:", port);
})