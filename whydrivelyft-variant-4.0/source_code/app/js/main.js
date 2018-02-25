import { stickyNav } from '../js/sticky-nav.js';
import { ctaHome } from '../js/cta-home.js';
import { Form } from '../js/form.js';
import { smoothScroll } from '../js/smooth-scroll.js';
import { verifyNumber } from '../js/verify.js';
import { utmTracker } from '../js/utm-tracker.js';
import { customTracker } from '../js/custom-tracker.js';
import { scroller } from '../js/goto-top.js';
import { questionsAccordian } from '../js/accordian.js';
import { fullStoryInit } from '../js/full-story-init.js';
import { bonus } from '../js/bonus.js';
import { firePixelTracker } from '../js/tracker.js';
import { countDownTimer } from '../js/countdown-timer.js';
import { SignUpForm } from '../js/signup-form.js';
import { SignUpFormFloating } from '../js/signupform-floating.js';
import * as utmAPI from '../js/utm-api.js';
import { activeNav } from '../js/active-nav.js';
import '../scss/style.scss';

/**
 * Manages functionality on Lyft page.
 */
export function Lyft() {
  new firePixelTracker();
  new customTracker();
  new questionsAccordian();
  new activeNav();
  let intervalObj = setInterval(function() {
    if (window.isTrackerLoad) {
      new utmTracker();
      if (document.getElementById('bonus')) {
        new bonus();
      }
      clearInterval(intervalObj);
    }
  }, 200);

  // only enable fullstory if it hasn't already been enabled
  setTimeout(function() {
    if (window._fs_namespace !== 'FS') {
      new fullStoryInit();
    }
  }, 500);

  if (document.getElementById('apply-form')) {
    new Form();
  }

  if (document.getElementById('timerbox')) {
    new countDownTimer();
  }

  if (document.getElementById('home-cta')) {
    new ctaHome();
  }

  if (document.getElementById('verify-page')) {
    new verifyNumber();
  }
  new smoothScroll();
  if (document.getElementById('goto-top')) {
    new scroller();
  }

  //Sticky Navigation function
  if (document.getElementsByClassName('fixed-nav')[0] && document.getElementsByClassName('promo-banner')[0]) {
    new stickyNav();
  }

  //Floating form
  if(document.getElementById('apply-signup-form')){
    new SignUpForm();
    new SignUpFormFloating();
  }
}

/**
 * Callback function for maps api.
 */
window.initAutoComplete = function() {
  let regionEl = document.getElementById('region');
  let latEl = document.getElementById('lat');
  let lngEl = document.getElementById('lng');
  let selectedCityName;
  let options = {
    componentRestrictions: {country: 'us'},
    types: ['(cities)']
  };


  // Has user pressed the down key to navigate autocomplete options?
  let hasDownBeenPressed = false;

  // Default listener outside to stop nested loop returning odd results
  regionEl.addEventListener("keydown", e => {
    if (e.keyCode === 40) {
      hasDownBeenPressed = true;
    }
  });
  // GoogleMaps API custom eventlistener method
  google.maps.event.addDomListener(regionEl, "blur", e => {
    // Maps API e.stopPropagation();
    e.cancelBubble = true;
      // If user isn't navigating using arrows and this hasn't ran yet
      if (!hasDownBeenPressed && !e.hasRanOnce) {
        google.maps.event.trigger(e.target, "keydown", {
          keyCode: 40,
          hasRanOnce: true
        });
      }

  });

  // GoogleMaps API custom eventlistener method
  google.maps.event.addDomListener(regionEl, "keydown", e => {
    // Maps API e.stopPropagation();
    e.cancelBubble = true;
    // If enter key, or tab key
    if (e.keyCode === 13 || e.keyCode === 9) {
      // If user isn't navigating using arrows and this hasn't ran yet
      if (!hasDownBeenPressed && !e.hasRanOnce) {
        google.maps.event.trigger(e.target, "keydown", {
          keyCode: 40,
          hasRanOnce: true
        });
      }
    }
  });


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


/* for new simple form */
window.initAutoCompleteSignUpFloating = function() {

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


window.onload = new Lyft();
