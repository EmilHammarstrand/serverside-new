
window.addEventListener('load', () => {
    let inputName = document.getElementById('nameInput');
    let inputYear = document.getElementById('yearInput');
    let inputPrice = document.getElementById('priceInput');
    let addBoatBtn = document.getElementById('addNewBoat');
    let getAllBoatsBtn = document.getElementById('getBoatsBtn');
    let boatList = document.getElementById('boatList');
    let y_n_sailboat = document.querySelectorAll('input[name="y_n_sailboat"]');
    let y_n_engine = document.querySelectorAll('input[name="y_n_engine"]');
    let clearBoats = document.getElementById('clearDatabase');
    let searchInput = document.getElementById('searchInput');
    let categories = document.querySelector('#categories');
    let sortButtons = document.getElementById('sortButtons');

    async function getAllBoats(){ // FUNKTION SOM HÄMTAR ALLA BÅT DOKUMENT FRÅN DATABASEN

        const response = await fetch('/boats', { method: 'GET'}  );
        const object = await response.json();

        boatList.innerHTML = '';
        showBoats.innerHTML = 'Our Boats: ';

        object.forEach(boat => {
            let li = document.createElement('li');
            let deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = "Delete";
            deleteBtn.className = "deleteBtn";


            li.innerHTML = `Model: ${boat.name}<br>  Year built: ${boat.year}<br> Price: ${boat.price}<br> Sailboat?: ${boat.sailboat}<br> Any Engine?: ${boat.engine}<br><br>`

            boatList.appendChild(li)
            li.appendChild(deleteBtn)

            deleteBtn.addEventListener('click', async () => {
                try{
                    await fetch(`/boat?id=${boat._id}`, {method: 'DELETE'})
                    getAllBoats();
                } catch(error) {
                    console.log('Kunde inte deletea båten, error: ', error.message)
                }
            })
        })
    };

    getAllBoatsBtn.addEventListener('click', async () => { // KALLAR PÅ GETALLBOATS
        getAllBoats();
    })

    addBoatBtn.disabled = true;
    inputPrice.addEventListener('keyup', () => { // DISABLE ADDBOAT KNAPPEN OM INPUTS ÄR TOMMA
        if(inputPrice.value  === ""){
            console.log('disabled');
            addBoatBtn.disabled = true;
          }
        
          else {  
            console.log('enabled');
            addBoatBtn.disabled = false;
            }
    });

    clearBoats.addEventListener('click', async () => {

        let staticBoats = [
            {name: "Yamaha",
            year: 2002,
            price: 100200,
            sailboat: "Yes",
            engine: "Yes"
        },{
            name: "Johnson",
            year: 1992,
            price: 30000,
            sailboat: "No",
            engine: "Yes"
        },{
            name: "Mercury",
            year: 1959,
            price: 31000,
            sailboat: "No",
            engine: "Yes"
        },{
            name: "Linjett",
            year: 2007,
            price: 190500,
            sailboat: "Yes",
            engine: "Yes"
        },{
            name: "Merucas",
            year: 1922,
            price: 71100,
            sailboat: "Yes",
            engine: "No"
        },
        {   name: "Boatsson",
            year: 1950,
            price: 100200,
            sailboat: "No",
            engine: "Yes"
        },{
            name: "Johnson",
            year: 1992,
            price: 30000,
            sailboat: "No",
            engine: "Yes"
        },{
            name: "Mercury",
            year: 1959,
            price: 325000,
            sailboat: "No",
            engine: "Yes"
        },{
            name: "Linjett",
            year: 2007,
            price: 190500,
            sailboat: "Yes",
            engine: "Yes"
        },{
            name: "Ettny",
            year: 1930,
            price: 1000,
            sailboat: "Yes",
            engine: "No"
        }]

        await fetch('/clearDatabase',
            {headers:
                {'Accept' : 'application/json',
                'Content-Type' : 'application/json'
                },
            method: 'POST',
            body:JSON.stringify(staticBoats)
            }
        )
        getAllBoats();
    })

    addBoatBtn.addEventListener('click', async () => {      // LÄGGER TILL BÅTDOKUMENT TILL DATABASEN OCH KALLAR PÅ GETALLBOATS
        
        for (const rb of y_n_sailboat) {
            if (rb.checked){
               var selectedValueSailboat = rb.value;
                break;
            }
        }
    
        for (const rb of y_n_engine){
            if (rb.checked){
               var selectedValueEngine = rb.value;
                break;
            }
        }
        
        let name = inputName.value;
        let year = inputYear.value;
        let price = inputPrice.value;
        let sailboat = selectedValueSailboat;
        let engine = selectedValueEngine;
        let newBoat = {name, year, price, sailboat, engine};
        
        await fetch('/boat', {  // ADD A BOAT 
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(newBoat)
        });


        let deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = "Delete";
        deleteBtn.className = "deleteBtn";
        let li = document.createElement('li');
        li.innerHTML = `Model: ${newBoat.name}<br>  Year built: ${newBoat.year}<br> Price: ${newBoat.price}<br> Sailboat?: ${newBoat.sailboat}<br> Any Engine?: ${newBoat.engine} <br>`;
        boatList.appendChild(li);
        li.appendChild(deleteBtn)
        getAllBoats();

        inputName.value = "";
        inputYear.value = "";
        inputPrice.value = "";
        addBoatBtn.disabled = true;
    });

    searchInput.addEventListener('input', async () => {                              // SEARCH FOR BOAT PRICE AND NAME
        
        let searchParameter = searchInput.value;
        let selectedCategory = categories.value;
        let sort = sortButtons.value;

        console.log("search funkar")
      
        try{

            const response = await fetch (`/search?${selectedCategory}=${searchParameter}&order=${sort}`, {method:'GET'})
            const results = await response.json();

            boatList.innerHTML = "";
            results.forEach(searchResult => {
              
                let li = document.createElement('li');
                li.innerHTML = `Model: ${searchResult.name}<br> Year Built: ${searchResult.year}<br> Price: ${searchResult.price}<br> Sailboat?: ${searchResult.sailboat}<br> Any Engine?: ${searchResult.engine}`;
                boatList.appendChild(li);
                
            })
        }
        catch(error){
            console.log('Search went wrong, ERROR: ', error.message)
        }
       
    })
})
