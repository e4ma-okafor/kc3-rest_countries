const themeSwitch = document.getElementById('theme-switch');
const body = document.querySelector('body');
const icon = document.querySelector('.bi');
const modeText = document.querySelector('.theme');
let searchInput = document.getElementById("search-Input");
let dropdownBtn = document.getElementById("dropdown-btn");
let dropdownBox = document.getElementById("dropdown-box");
let dropdownItems = document.querySelectorAll(".dropdown-item");
const worldCountries = document.getElementById("world-countries");
const continentSelect = document.getElementById("continent-select");
let countriesArray = [];

themeSwitch.addEventListener('click', function () {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        icon.setAttribute('class', 'bi bi-brightness-high-fill');
        modeText.textContent = 'Light mode';        
    } else {
        icon.setAttribute('class', 'bi bi-moon-fill');
        modeText.textContent = 'Dark mode';
    }
})

dropdownBtn.addEventListener('click', () => {
    dropdownBox.classList.toggle('hide')
})

dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
        dropdownBox.classList.add('hide');

        const selectedContinent = item.textContent.trim();
        console.log(selectedContinent);
        worldCountries.innerHTML = "";
        let continentS;

        if (selectedContinent == 'All') {
            continentS = countriesArray;
            console.log(continentS);
        } else if (selectedContinent) {            
            continentS = countriesArray.filter((country) => country.continent === selectedContinent);
            console.log(countriesArray);            
            console.log(continentS);
        }
        displayCountries(continentS);
    })
})

const fetchCountries = () => {
    worldCountries.innerHTML = '';
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            countriesArray = data.map(item => {
                return {
                    'name': item.name.common,
                    'population': item.population,
                    'continent': item.continents[0],
                    'capital': item.capital || 'nil',
                    'flag': item.flags.png,
                    'code': item.cca3,
                    'borders': item.borders || []
                }
            }).sort(() => Math.random() - Math.random());

            displayCountries(countriesArray);
        })
        .catch(err => {
            console.log(err)
            let errorMessage = `
                                    <div class="text-center">
                                        <h2 class="fw-bolder fs-1">404</h2>
                                        <p class="mt-5 fs-4">Could not load countries due to
                                            <br/><span>${err.toString()}</spam>
                                        </p>
                                    </div>
                                `
            worldCountries.style.display = 'flex';            
            worldCountries.style.justifyContent = 'center';                  
            worldCountries.innerHTML = errorMessage;
        })
}
fetchCountries();

searchInput.addEventListener('input', () => { 
    displaySearch();   
    /*const searchTerm = searchInput.value.toLowerCase();
    console.log(searchTerm);
    
    const filteredCountries = countriesArray.filter(country =>        
        country.name.toLowerCase().includes(searchTerm));  
    
    console.log(filteredCountries);
    if (filteredCountries.length > 0) {
        console.log("Name found: ", filteredCountries);
        displayCountries(filteredCountries);
    } else {
        console.log("Name not found");
    } */ 
});

searchInput.addEventListener('keypress', () => {
    if (Event.keyCode === 13 || Event.which === 13) {
        displaySearch();
    }
})

const displaySearch = () => {
    const searchTerm = searchInput.value.toLowerCase();
    console.log(searchTerm);
    
    const filteredCountries = countriesArray.filter(country =>        
        country.name.toLowerCase().includes(searchTerm));  
    
    console.log(filteredCountries);
    if (filteredCountries.length > 0) {
        console.log("Name found: ", filteredCountries);
        displayCountries(filteredCountries);
    } else {
        console.log("Name not found");
    }  
}

const displayCountries = arr => {
    let card = ``;
    for (let i = 0; i < arr.length; i++) {
        card += `<a href="country.html?country=${arr[i].code}" class="text-decoration-none m-0 p-0">
                    <div class="country-card rounded">
                        <div class="flag ratio ratio-16x9">
                            <img src="${arr[i].flag}" alt="Flag of ${arr[i].name}" class="img-fluid">
                        </div>
                        <div class="card-body d-flex flex-column py-3 px-4">
                            <h2 class="country-name h5 fw-bold mb-3">${arr[i].name}</h2>
                            <p class="fw-bold fs-small mb-1">Population: <span class="population fw-normal">${arr[i].population.toLocaleString()}</span></p>
                            <p class="fw-bold fs-small mb-1">Continent: <span class="region fw-normal continentName">${arr[i].continent}</span></p>
                            <p class="fw-bold fs-small mb-3">Capital: <span class="capital fw-normal">${arr[i].capital}</span></p>
                        </div>
                    </div>
                </a>`
    }

    worldCountries.innerHTML = card;    
}

/*dropdownItems.forEach((item) => {
    item.addEventListener('click', () => {
        const selectedContinent = item.textContent;
        console.log(selectedContinent);
        worldCountries.innerHTML = "";
        let continentS;

        if (selectedContinent) {
            continentS = countriesArray.filter((country) => country.continent === selectedContinent);
            console.log(countriesArray);            
            console.log(continentS);
        } else {
            continentS = countriesArray;
        }
        displayCountries(continentS);
    })
})*/
