import * as utmAPI from '../js/utm-api.js';

/* for new simple form */
export const googleAutocomplete = () => {
  window.initAutoCompleteSignUp = function() {

    let regionEl = document.getElementById('signup-region');
    let latEl = document.getElementById('signup-lat');
    let lngEl = document.getElementById('signup-lng');
    let selectedCityName;
    let options = {
      componentRestrictions: {country: 'us'},
      types: ['(cities)']
    };

    var autoComplete = new google.maps.places.Autocomplete(regionEl, options);

    autoComplete.addListener('place_changed', function() {
      window.isCitySelected = true;
      selectedCityName = autoComplete.getPlace();
      window.cityName = selectedCityName.formatted_address;
      regionEl.value = selectedCityName.formatted_address;
      latEl.value = selectedCityName.geometry.location.lat();
      lngEl.value = selectedCityName.geometry.location.lng();

      let formattedSelectedCity = window.cityName.replace(/,/g, '').replace(/\s+/g, '-').toString();
      ampt.track('SelectedCity', utmAPI.default.getUtmParams({city: formattedSelectedCity}));
      safariAmpt.track('selectedcity', utmAPI.default.getUtmParams({city: formattedSelectedCity}));
    });
  }
}