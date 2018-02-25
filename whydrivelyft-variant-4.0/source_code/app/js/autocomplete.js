import * as utmAPI from '../js/utm-api.js';
const firebase = require('firebase/app')
require("firebase/database");

if (!window._babelPolyfill) {
  require("babel-polyfill");
}

// Initialize Firebase
const config = {
  apiKey: "AIzaSyBHop9qGYAMqwULXcEJiLEGL2hS8dXZ-dc",
  authDomain: "lyftaddressvalid-1502317118818.firebaseapp.com",
  databaseURL: "https://lyftaddressvalid-1502317118818.firebaseio.com",
  projectId: "lyftaddressvalid-1502317118818",
  storageBucket: "lyftaddressvalid-1502317118818.appspot.com",
  messagingSenderId: "262018765574"
};
firebase.initializeApp(config);

/**
 * Callback function for autocomplete
 */
export const Autocomplete = () => {
  window.initAutoCompleteSignUp = () => {
    const regionEl = document.getElementById('region') || document.getElementById('signup-region');
    const latEl = document.getElementById('lat') || document.getElementById('signup-lat');
    const lngEl = document.getElementById('lng') || document.getElementById('signup-lng');
    const autocompleter = document.getElementById('autocompleter') || document.getElementById('signup-autocompleter');
    const autoComplete = new google.maps.places.AutocompleteService();
    const distance = new google.maps.DistanceMatrixService();
    const geocoder = new google.maps.Geocoder();;
    const memoizeObj = {};
    //firebase
    const db = firebase.database();
    const majorMarkets = db.ref();
    const latlng = db.ref('/latlng');
    let noDup = {};
    let selectedCityName;

    //take city name and make call to firebase to find major market for that city if it exists && creating element for it
    const getMajorMarket = (name, value) => {
      return new Promise((resolve, reject) => {
        majorMarkets.orderByKey().equalTo(name).once('value')
        .then(result => {
          if (result.val()) {
            let market = result.val()[name].market;
            for(let k=0; k < market.length; k++) {
              if(k < 2) {
                let majorNode = `<div class='pac-item major-market' name='${market[k]}'><div class='pac-icon'><img src="img/map.svg"></div>${market[k].split(",", 2).join()}<span>**Top Earning City**<span class="tooltiptext">People who drive in these cities earn up to 40% more!</span></span></div>`;
                !noDup[market[k]+value] && memoizeObj[value].push(majorNode);
                noDup[market[k]+value] = true;
              }
            }
          }
          resolve(memoizeObj[value])
        })
        .catch(error => {
          resolve([])
        })
      })
    }

    //Promisified place prediction api call returns an array with all predictions + major market
    const getPredictions = input => {
      return new Promise((resolve, reject) => {
        autoComplete.getPlacePredictions({"input": input, componentRestrictions: {country: "us"}, types: ['(cities)']}, async (results, status) => {
          if (status == "OK") {
            for (let j=0; j < results.length; j++) {
              if (j < 4) {
                let description = results[j].description;
                let id = results[j].place_id;
                memoizeObj[input] = memoizeObj[input] || [];
                //create a node and add it to the memoizeObj & push it to array
                let node = `<div class='pac-item' name='${description}' id='${id}'><div class='pac-icon'><img src="img/map.svg"></div>${description}</div>`;
                memoizeObj[input].push(node)
                if(input.length > 2 && j < 1) await getMajorMarket(description, input);
              }
            }
            resolve(memoizeObj[input]);
          } else {
            resolve([]);
          }
        });
      });
    }

    //on input change
    regionEl.addEventListener('input', async evt => {
      var targetElement = evt.target || evt.srcElement;
      if (!targetElement.value) {
        autocompleter.innerHTML = '';
      } else {
        if (memoizeObj[targetElement.value]) return autocompleter.innerHTML = memoizeObj[targetElement.value].join('');
        await getPredictions(targetElement.value)
        autocompleter.innerHTML = (memoizeObj[targetElement.value] || []).join('');
      }
    });

    // once city is selected
    autocompleter.addEventListener("click", e => {
      let target = e.target;
      if(e.target.parentNode.className === 'pac-item major-market') target = e.target.parentNode;
      if(target.className === 'pac-item' || target.className === 'pac-item major-market') {
        if(target.id) {
          geocoder.geocode({placeId: target.id}, (details, status) => {
            latEl.value = details[0].geometry.location.lat();
            lngEl.value = details[0].geometry.location.lng();
          })
        } else {
          let name = target.getAttribute('name');
          latlng.orderByKey().equalTo(name).once('value')
          .then(results => {
            latEl.value = results.val()[name][0];
            lngEl.value = results.val()[name][1];
          })
          .catch(error => {
          })
        }
        selectedCityName = target.getAttribute('name');
        window.isCitySelected = true;
        window.cityName = selectedCityName;
        regionEl.value = selectedCityName;
        autocompleter.innerHTML = '';

        let formattedSelectedCity = window.cityName.replace(/,/g, '').replace(/\s+/g, '-').toString();
        ampt.track('SelectedCity', utmAPI.default.getUtmParams({city: formattedSelectedCity}));
        safariAmpt.track('selectedcity', utmAPI.default.getUtmParams({city: formattedSelectedCity}));
      }
    });
  }
}
