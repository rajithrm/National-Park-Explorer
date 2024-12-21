const readMoreButton = document.createElement('button');
document.getElementById('searchButton').addEventListener('click', searchParks);

async function fetchParks() {
    const apiKey = 'BZX2WxrY07Aig0mXXBbxxBkVBmgC2fhCzKWgKtci';
    const apiUrl = `https://developer.nps.gov/api/v1/parks?api_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);
        return data;
    }
    catch(error){
        console.error('Error fetching data:',error);
    }
}

// async function displayParks(){
//     const parksList = document.getElementById('parksList');
//     // parksList.innerHTML = '';
//     const parksData = await fetchParks();

//     parksData.forEach(park => {
//         const parkDiv = document.createElement('div');
//         parkDiv.classList.add('park');

//         parkDiv.innerHTML+=`
//         <h2>${park.fullName}</h2>
//         <p>${park.description}</p>
//         <p><strong>Location:</strong> ${park.states}</p>
//         `;
//         parksList.appendChild(parkDiv);
//     });
// }

async function displayParks() {
    const parksList = document.getElementById('parksList');
    parksList.innerHTML = '';

    try {
        const parksData = await fetchParks();

        parksData.data.forEach(park => {
            const parkDiv = document.createElement('div');
            parkDiv.classList.add('park');

            const parkImage = document.createElement('img');
            parkImage.src = park.images[0].url;
            parkImage.alt = park.images[0].altText;
            parkImage.classList.add('park-image');

            parkDiv.appendChild(parkImage);

            parkDiv.innerHTML += `
                <h2>${park.fullName}</h2>
                <h3>States:</h3>
                <h4>${park.states}</h4> 
            `;

            const readMoreButton = document.createElement('button');
            readMoreButton.textContent = 'Read more';
            readMoreButton.classList.add('read-more');

            readMoreButton.addEventListener('click', () => {

                parksList.querySelectorAll('.park').forEach(item => {
                    item.style.display = 'none';
                    parksList.display = 'none';
                });
            
                const newDiv = document.createElement('div');
                newDiv.classList.add('new-div');
                
                newDiv.innerHTML = `
                    <h2>${park.fullName}</h2>
                    <img src="${park.images[0].url}" alt="${park.images[0].altText}">
                    <p>${park.description}</p>
                    <h3>States:</h3>
                    <h4>${park.states}</h4>
                    <h3>Activities:</h3>
                    <ul>
                        ${park.activities.map(activity => `<li>${activity.name}</li>`).join('')}
                    </ul>
                    
                    
                `;
                
                parksList.appendChild(newDiv);
            
                const readLessButton = document.createElement('button');
                readLessButton.textContent = 'Read less';
                readLessButton.classList.add('read-less');
            
                readLessButton.addEventListener('click', () => {
                    newDiv.remove(); 
                    readLessButton.remove(); 
                    parksList.querySelectorAll('.park').forEach(item => {
                        item.style.display = 'block';
                    });
                });
            
                parksList.appendChild(readLessButton);
            
            });
            

            parkDiv.appendChild(readMoreButton);

            parksList.appendChild(parkDiv);
        });
        const states = parksData.data.map(park => park.states).filter((value, index, self) => self.indexOf(value) === index);
        // filterByState(states);
        populateStatesDropdown(states);
    } catch (error) {
        console.error('Error displaying parks:', error);
    }
}


// let searchedParkNames = [];

// document.getElementById('searchButton').addEventListener('click', searchParks);

// async function searchParks() {
//     let parkList = document.querySelector('#parksList');
//     parkList.style.display = "none";

//     let Searched = document.getElementById("Searched");
//     Searched.innerHTML = '';

//     let searchingResult = await fetchParks();
//     let searchInput = document.getElementById('searchInput').value.trim().toLowerCase();

//     const parks = Object.values(searchingResult.data);

//     parks.forEach(park => {
//         const parkName = park.fullName.toLowerCase();
//         if (parkName.includes(searchInput)) {
//             const searchResult = document.createElement('div');
//             searchResult.className = `parkNew`;
//             Searched.appendChild(searchResult)
//             searchResult.innerHTML = `
         
//             <h2>${park.fullName}</h2>
//             <img src="${park.images[0].url}" alt="${park.images[0].altText}">

//             `;

//             if(searchInput==""){
//                 searchResult.style.display="none";
//                 parkList.style.display = "grid";
//             }
//             else if (!searchedParkNames.includes(searchInput)) {
//                 searchedParkNames.push(searchInput);
//             }
//         }
//     });
// }

function searchParks() {

    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    let state= document.getElementById('stateFilter').value
    console.log(searchInput)
    console.log(state)
    const parks = document.querySelectorAll('.park');
    console.log(parks)

    parks.forEach(park => {
        const parkName = park.querySelector('h2').textContent.toLowerCase();
        const match = parkName.includes(searchInput);
        park.style.display = match ? 'block' : 'none';
    });
}

function filterParksByState(selectedState) {
    console.log(selectedState)
    const parks = document.querySelectorAll('.park');

    parks.forEach((item)=>{
        const parkstate=item.querySelector('h4').textContent
        let match = parkstate.includes(selectedState)
        item.style.display= match ?'block':'none';
    })
   
}

function populateStatesDropdown(states) {
    const stateSelect = document.getElementById('stateFilter');
    
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateSelect.appendChild(option);
    });

    stateSelect.addEventListener('change', function() {
        const selectedState = stateSelect.value;
        
        filterParksByState(selectedState);
    });
}

displayParks();