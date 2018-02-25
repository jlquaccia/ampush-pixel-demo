import { stickyNav } from '../js/sticky-nav.js';
import { utmTracker } from '../js/utm-tracker.js';
import { smoothScroll } from '../js/smooth-scroll.js';
import { faqAccordian } from '../js/faq-accordian.js';
import { firePixelTracker } from '../js/tracker.js';
import { scroller } from '../js/goto-top.js';
import { bonus } from '../js/bonus.js';
import { sliderThumbnail } from '../js/slider-thumbnail.js';
import { customTracker } from '../js/custom-tracker.js';
import { fullStoryInit } from '../js/full-story-init.js';
import { SignUpForm } from '../js/signup-form.js';
import { SignUpFormFloating } from '../js/signupform-floating.js';
import { accelerate } from '../js/accelerate.js';
import { activeNav } from '../js/active-nav.js';
import * as utmAPI from '../js/utm-api.js';
import '../scss/faq-style.scss';

/**
 * Manages functionality on Lyft page.
 */
export function Lyft() {
  new firePixelTracker();
  new faqAccordian();
  new stickyNav();
  new customTracker();
  new smoothScroll();
  new accelerate();
  new activeNav();
  // only enable fullstory if it hasn't already been enabled
  setTimeout(function() {
    if (window._fs_namespace !== 'FS') {
      new fullStoryInit();
    }
  }, 500);

  let intervalObj = setInterval(function() {
    if (window.isTrackerLoad) {
      new utmTracker();
      if (document.getElementById('bonus')) {
        new bonus();
      }
      clearInterval(intervalObj);
    }
  }, 200);

  if (document.getElementsByClassName('slider-thumbnail')[0]) {
    new sliderThumbnail();
  }

  //Sticky Navigation function
  if (document.getElementsByClassName('fixed-nav')[0]) {
    new stickyNav();
  }

  if (document.getElementById('goto-top')) {
    new scroller();
  }

  //Floating form
  if(document.getElementById('apply-signup-form')){
    new SignUpForm();
    new SignUpFormFloating();
  }
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
