const themeSwitch = document.getElementById('theme-switch');
const body = document.querySelector('body');
const icon = document.querySelector('.bi');
const modeText = document.querySelector('.theme');
let screenMode;
const backBtn = document.querySelector(".back-btn");
const theCountry = document.getElementById("the-country")
let countryCode = new URLSearchParams(window.location.search).get("country");
let allCountries = [];
let countryArray = [];

window.onload = () => {
    if (localStorage.getItem('screenMode') === 'dark') {
        dark.classList.remove('hide');
        light.classList.add('hide');
        body.classList.add('dark-mode');
    }
}

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

const fetchCountries = () => {
    theCountry.innerHTML = '';
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            allCountries = data.map(item => {
                return [item.cca3, item.name.common]
            })
            data = data.filter(item => item.cca3 === countryCode)
            console.log(data);          
            document.title = `${data[0].name.common} - Countries of the world`

            const borders = arr => {
                let newArr = [], coun = '';
                if (arr != undefined) {
                    for (let item of arr) {
                        coun = allCountries.filter(a => a[0] === item)
                        newArr.push(coun[0][1])
                    } 
                }
                return newArr
            }

            countryArray = data.map(item => {
                const lang = obj => {
                    let arr = Object.entries(obj), newArr = [];
                    for (let item of arr) {
                        newArr.push(item[1])
                    }
                    return newArr.join(', ')
                }

                const cur = obj => {
                    let arr = Object.entries(obj), newArr = [];
                    for (let item of arr) {
                        newArr.push(item[1].name)
                    }
                    return newArr.join(', ') 
                }

                return {
                    'commonName': item.name.common,
                    'nativeName': Object.entries(item.name.nativeName)[0][1].common,
                    'population': item.population.toLocaleString(),
                    'region': item.region,
                    'subRegion': item.subregion || 'nil',
                    'continent': String(item.continents),
                    'capital': String(item.capital || 'nil') ,
                    'tld': String(item.tld),
                    'currencies': cur(item.currencies),
                    'languages': lang(item.languages),
                    'borders': borders(item.borders),
                    'bordersShort': item.borders,
                    'flag': item.flags.png
                }
            });   
            displayCountry(countryArray);
        })
        .catch(err => {
            console.log(err)
            let errorMessage = `
                                    <div class="text-center">
                                        <h2 class="fw-bolder fs-1">404</h2>
                                        <p class="mt-5 fs-4">Cannot display country now due to
                                            <br/><span>${err.toString()}</spam>
                                        </p>
                                    </div>
                                `
            theCountry.style.display = 'flex';            
            theCountry.style.justifyContent = 'center';                  
            theCountry.innerHTML = errorMessage;
        })
}
fetchCountries();

const displayCountry = arr => {
    const borderBtns = () =>{
        let bCBtn = ``;
        if (arr[0].borders != undefined) {
            for (let i = 0; i < arr[0].borders.length; i++) {
                bCBtn +=    `
                            <a class="btn ms-3 mb-3" href="country.html?country=${arr[0].bordersShort[i]}" role="button">
                                ${arr[0].borders[i]}
                            </a>`
            }
        }
        return bCBtn;
    }

    card = `<div class="flag">
                <img src="${arr[0].flag}" alt="Flag of ${arr[0].commonName}" class="w-100 h-100">
            </div>
            <div class="details d-flex align-items-center">
                <div class="details-wrap w-100">
                    <h1 class="country-name fw-800 mb-4">${arr[0].commonName}</h1>
                    <div class="detail-columns my-3">
                        <div class="column1">
                            <p class="mb-2">Native Name: <span class="native_name">${arr[0].nativeName}</span></p>
                            <p class="mb-2">Population: <span class="population">${arr[0].population}</span></p>
                            <p class="mb-2">Region: <span class="region">${arr[0].region}</span></p>                            
                            <p class="mb-2">Capital: <span class="capital">${arr[0].capital}</span></p>
                        </div>
                        <div class="column2">
                            <p class="mb-2">Top Level Domain: <span class="tld">${arr[0].tld}</span></p>
                            <p class="mb-2">Currencies: <span class="currencies">${arr[0].currencies}</span></p>
                            <p class="mb-2">Sub-Region: <span class="sub-region">${arr[0].subRegion}</span></p>
                            <p class="mb-2">Languages: <span class="languages">${arr[0].languages}</span></p>
                        </div>
                    </div>
                    <div class="borders d-flex justify-content-between mt-4">
                        <p>Border Countries: </p>
                        <div id="bcs" class="border-countries">
                            ${borderBtns()}
                        </div>
                    </div>
                    
                </div>
            </div>`

    theCountry.innerHTML = card;   
}

