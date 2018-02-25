import { bonus } from '../js/bonus.js';
import { SignUpForm } from '../js/signup-form.js';
import { utmTracker } from '../js/utm-tracker.js';
import { customTracker } from '../js/custom-tracker.js';
import { firePixelTracker } from '../js/tracker.js';
import { fullStoryInit } from '../js/full-story-init.js';
import { Autocomplete } from '../js/autocomplete.js';
import { googleAutocomplete } from '../js/google-autocomplete.js';
import * as utmAPI from '../js/utm-api.js';
import '../scss/signup-form-style.scss';

/**
 * Manages functionality on Lyft page.
 */
export function SimpleForm() {
  new firePixelTracker();
  new customTracker();

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

  new SignUpForm();

  if (document.getElementById('signup-autocompleter')) {
    new Autocomplete();
  } else {
    new googleAutocomplete();
  }
}

window.onload = new SimpleForm();
