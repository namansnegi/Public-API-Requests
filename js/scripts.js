/*
Treehouse Techdegree:
FSJS Project 5 - Public API Requests
*/

// Function to get data using Fetch API

function fetchData(url) {
  return fetch(url)
           .then(checkStatus)           // Check for OK response status  
           .then(res => res.json())     // Parse response into json 
           .catch(error => {            // Throw error message in case of a problem
            console.log('Looks like there was a problem!', error)
            document.getElementById('gallery').innerHTML = '<h3>Uh oh! There was an error receiving the users!</h3>'
         })
}

// function to check the response status: OK or not 
function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}



// function to use the data retrived from the FETCH API and append to the appropriate HTML template

function addUserData(item){
  let html = `<div class="card" id="${item.name.first}${item.name.last}">
                        <div class="card-img-container">
                            <img class="card-img" src="${item.picture.large}" alt="${item.name.first} ${item.name.last}">
                        </div>
                        <div class="card-info-container">
                            <h3 id="name" class="card-name cap">${item.name.first} ${item.name.last}</h3>
                            <p class="card-text">${item.email}</p>
                            <p class="card-text cap">${item.location.city}, ${item.location.state} ${item.nat}</p>
                        </div>
                    </div>`;
  return html;
}


//Creates the modal cards and add close button and prev and next buttons and their functionalities

 function modalCardsGen(item, data, index){

  item.formattedDOB = formatDOB(item.dob.date) 

  const div = document.createElement('div');
  div.className = "modal-container";  
  div.innerHTML = singleCard(item);

  document.querySelector('body').appendChild(div)

  // disables next or prev button if indec is 0 or 11
  if (index >= 11) {
        document.getElementById('modal-next').disabled= true;
    } else {
        document.getElementById('modal-next').disabled = false;
    }

  if (index <= 0) {
        document.getElementById('modal-prev').disabled = true;
    } else {
        document.getElementById('modal-prev').disabled = false;
    }

// click events for the buttons 
  document.getElementById("modal-prev").addEventListener('click',() => {
    newUser = data[index-1]
    div.remove();
    modalCardsGen(newUser, data, index-1);
  })

  document.getElementById("modal-next").addEventListener('click',() => {
    newUser = data[index+1]
    div.remove();
    modalCardsGen(newUser, data, index+1);
  })

  document.getElementById("modal-close-btn").addEventListener('click',() => {
    div.remove();
  })

// click event to close the model if clicked outside the modal card
  document.onclick = function(event) {

    modal = document.querySelector(".modal-container")
    if (event.target === modal) {
      div.remove();

  }
}

}

// function for the HTML template for a Modal card

function singleCard(item){
    let card = `<div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${item.picture.large}" alt="${item.name.first} ${item.name.last}">
                        <h3 id="name" class="modal-name cap">${item.name.first} ${item.name.last}</h3>
                        <p class="modal-text">${item.email}</p>
                        <p class="modal-text cap">${item.location.city}, ${item.location.country}</p>
                        <hr>
                        <p class="modal-text">Cell: ${item.cell}</p>
                        <p class="modal-text">Address: ${item.location.street.number} ${item.location.street.name}, ${item.location.city}, ${item.location.state} ${item.location.postcode}</p>
                        <p class="modal-text">Birthday: ${item.formattedDOB}</p>
                    </div>
                    <div class="modal-btn-container">
                        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                        <button type="button" id="modal-next" class="modal-next btn">Next</button>
                    </div>
                </div>`;
      return card;
}

// function for the click event that will show the modal cards
function showCards(item, data, index){
  setTimeout(event => {

    let clickedUser = document.getElementById(`${item.name.first}${item.name.last}`);
    clickedUser.addEventListener('click', (e) => modalCardsGen(item, data, index));

   },100)

}

// funtion to format the date of birth
function formatDOB(date){

    var birthday = new Date(date);
    var month = birthday.getMonth() + 1;
    var day = birthday.getDate();
    var year = birthday.getFullYear();
    return month + "/" + day + "/" + year;
}

// function to add search HTML form and event listener to return search results
function searchBar() {
    // Creates and appends form
    const container = document.querySelector('.search-container');
    const form = `<form action="#" method="get">
                    <input type="search" id="search-input" class="search-input" placeholder="Search...">
                    <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
                </form>`;
    container.innerHTML = form;

    document.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      searchUser(e.target[0].value);
      e.target[0].value = '';
    });

  }

//Function to return search results 

function searchUser(val) {
    let find = val.toUpperCase();
    let users = document.getElementById('gallery').children;

    for (let i = 0; i < users.length; i++) {
        let h3 = users[i].querySelector('h3');
        let txtValue = h3.textContent || h3.innerText;

        if (txtValue.toUpperCase().indexOf(find) > -1) {
            users[i].style.display = "";
          } else {
            users[i].style.display = "none";
          }
    }
}


// run the main program

let userUrl = 'https://randomuser.me/api/?results=12&nat=gb,us,es'; // Url used to get data for 12 random users


fetchData(userUrl)
  .then(data => {data.results.map((item,index)=>{
  document.getElementById('gallery').insertAdjacentHTML('beforeend', addUserData(item))
  showCards(item, data.results, index);
  })
  
  });

searchBar();




