const { ObjectID } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'berrasboats';
const collection = 'berrasboats'



function get( filter, callback) {

    MongoClient.connect( url, { useUnifiedTopology : true }, async (error, client)=>{ 

        if(error){
            callback('Error occured, cant connect to database', error.message)
            return;
        }

        const theCollection = client.db(dbName).collection(collection);

        try{
            const cursor = theCollection.find(filter);
            const array = await cursor.toArray();
            callback(array);

        } catch(error){
            console.log('Wrong query, error: ', error.message);
            callback('Wrong query'); 

        } finally{
            client.close();
        }
    })
}

function addBoat(req, callback){                                  // LÄGG TILL BÅT I DATABASEN
    MongoClient.connect(url, { useUnifiedTopology : true }, async (error, client) => {
        if(error){
            callback('Error occured, cant connect to database')
            return;
        }
        const theCollection = client.db(dbName).collection(collection);

       try{
           
           const resultFromDatabase = await theCollection.insertOne(req)
           callback({
               resultFromDatabase: resultFromDatabase.result,
               ops: resultFromDatabase.ops
           })
           
       }catch(error){
           console.log('Fel med query, error: ', error.message)
           callback('query error')
       }finally{
           client.close();
       }
    })
}

function getBoatById(id, callback){
    get({_id: new ObjectID(id)}, callback)
    console.log(id)
}

function clearDatabase(req, callback){                                // RENSA DATABASEN FRÅN BÅTDOKUMENT
    MongoClient.connect(url, { useUnifiedTopology : true }, async (error, client) => {
        if(error){
            callback('Error occured, cant connect to database')
            return;
        }
        const theCollection = client.db(dbName).collection(collection);
        console.log(collection)

       try{
            theCollection.drop();
            const resultFromDatabase = await theCollection.insertMany(req)
           callback({
               resultFromDatabase: resultFromDatabase.result,
               ops: resultFromDatabase.ops
           })
       }catch(error){
           console.log('Fel med query, kunde inte tömma databasen, error: ', error.message)
           callback('query error')
       }finally{
           client.close();
       }
    })
}

function searchInput(query, callback){
    let filter = {};
    let sort = {}

    if (query.maxprice) {
        filter.price = {$lt: parseFloat(query.maxprice)};
    }

    if (query.word) {
        filter.name = { "$regex": `.*${query.word}.*`,"$options":"i"};
    }

     switch (query.order) {
        case  'name_asc':
            sort = { name : 1 }
            console.log('1')
            break;

        case  'name_desc':
            sort = { name : -1 }
            console.log('2')
            break;

        case  'lowprice':
            sort = { price : 1 }
            console.log('3')
            break;

        case  'oldest':
            sort = { year : 1 }
            console.log('4')
            break;
     
        case  'newest':
            sort = { price : -1 }
            console.log('5')
            break;
     }
    
    MongoClient.connect( url, { useUnifiedTopology : true }, async (error, client) => {
            if(error){
                callback('Error occured, cant connect to database')
                return;
            }
            const theCollection = client.db(dbName).collection(collection)
            try{
                const cursor = theCollection.find(filter).sort(sort).limit(5);
                const array = await cursor.toArray();
                callback(array);

            } catch(error){
                console.log('Query error: ', error.message);
                callback('ERROR med query'); 

            } finally{
                client.close();
            }
        }
    )
}

function deleteBoat(id, callback){
    let filter = {_id:new ObjectID(id)};

    MongoClient.connect(url,  { useUnifiedTopology : true }, async (error, client) => {
        if(error){
            callback('Error occured, cant connect to database')
            return;
        }
        const theCollection = client.db(dbName).collection(collection);
    
    try{
        const result = await theCollection.deleteOne(filter);
        callback(result);
        console.log(result)
    } catch(error){
        console.log('Fel, kan inte radera dokument, error: ', error.message)
        callback('Error')
    } finally{
        client.close();
    }
})
}

function getAllBoats(callback){
    get({}, callback)
}

module.exports = {
    getAllBoats,
    addBoat,
    clearDatabase,
    deleteBoat,
    getBoatById,
    searchInput
}