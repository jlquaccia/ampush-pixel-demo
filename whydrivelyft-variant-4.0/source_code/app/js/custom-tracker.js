import * as utmAPI from '../js/utm-api.js';

/**
 * Handles onclick tracking functionality for CTA buttons.
 *
 */
export function customTracker() {
  let trackerClass = document.getElementsByClassName('track');
	if (trackerClass) {
    for (let i = 0; i < trackerClass.length; i++) {
      trackerClass[i].addEventListener('click', handleTrackerTag, false);
		}
  }

  /**
   * Triggers tracking code and send the parameters which are set in data attributes.
   *
   * @param {!Event} e event object.
   */
  function handleTrackerTag(e) {
    // Ampush Tracking Pixel Code
    let dataTrack1 = e.target.getAttribute('data-track1');
    let safariDataTrack1 = e.target.getAttribute('safari-data-track1');
    dataTrack1 == undefined ? dataTrack1 = e.target.ownerDocument.activeElement.getAttribute('data-track1'):"";
    let dataTrack2 = e.target.getAttribute('data-track2');
    let buttonTrack = e.target.getAttribute('button-track');
    let safariButtonTrack = e.target.getAttribute('safari-button-track');
    let buttonTrack2 = e.target.getAttribute('button-track2');

    if(dataTrack1 && dataTrack2){
      ampt.track(dataTrack1, utmAPI.default.getUtmParams());
      ampt.track(dataTrack2, utmAPI.default.getUtmParams());

      if (safariDataTrack1) {
        safariAmpt.track(safariDataTrack1, utmAPI.default.getUtmParams());
      }
    }else if(buttonTrack){ /* CTA button clicks trigger Ampush-custom-event and Facebook Event*/
      ampt.track(buttonTrack, utmAPI.default.getUtmParams());
      
      if (safariButtonTrack) {
        safariAmpt.track(safariButtonTrack, utmAPI.default.getUtmParams());        
      }
      
      fbq('track', 'PageView');
      fbq('trackCustom', 'hyperlinkclick');

      if (buttonTrack2) {
        ampt.track(buttonTrack2, utmAPI.default.getUtmParams());
      }
      // hrefDelay('/?', 500); // wait 500ms before loading the next page so fb pixel has enough time to fire
    }else{
      ampt.track(dataTrack1, utmAPI.default.getUtmParams());
      
      if (safariDataTrack1) {
        safariAmpt.track(safariDataTrack1, utmAPI.default.getUtmParams());
      }
    }
  }

  /**
   * If a pixel is being cancelled or not firing before loading another page use this method and remove the href attribute from the anchor tag you would like to delay
   *
   *
   */
  function hrefDelay(URL, time) {
    setTimeout(function() {
      window.location = URL
    }, time);
  }
}
