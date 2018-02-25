/**
 * SignUpFormFloatingClass.
 */
const SignUpFormFloatingClass = {
  CTA: 'driver-cta',
  FIXED_CTA: 'fixed-cta-anchor',
  FORM: 'signup__container',
  HIDE: 'push-below',
  CROSS_PATH: 'cross-path',
  CROSS_SVG: 'cross-svg',
  CROSS: '.signup__content-cross svg',
  OVERLAY: 'overlay-full',
  BLACK: 'bg-black',
  HIDE_OVERFLOW: 'hide-overflow',
  PROMO_BANNER: 'promo-banner',
  SIGNUP_FORM_SCROLLABLE_AREA: 'signup__content',
  NAV: 'nav',
  HIDDEN: 'hide'
};

export function SignUpFormFloating() {
  let form_floating = document.getElementsByClassName(SignUpFormFloatingClass.FORM)[0];
  let cta_floating = document.getElementsByClassName(SignUpFormFloatingClass.FIXED_CTA)[0];
  let cross = document.querySelector(SignUpFormFloatingClass.CROSS);
  let cross_path = document.querySelector(SignUpFormFloatingClass.CROSS + ' path');
  let body =  document.getElementsByTagName('body')[0];
  let html =  document.getElementsByTagName('html')[0];
  let pos = 0;
  let overlay = document.getElementsByClassName(SignUpFormFloatingClass.OVERLAY)[0];
  let isFloatEnabled = cta_floating.getAttribute("data-isFloatFormEnabled");
  let bodyTag = document.getElementsByTagName('body')[0];
  let isFormOpenedOnce = false;
  let signupFormSrollContent = document.getElementsByClassName(SignUpFormFloatingClass.SIGNUP_FORM_SCROLLABLE_AREA)[0];

  cta_floating.addEventListener('click', animateUp);
  cross.addEventListener('click', animateUp);

  //function to fire pixel and add google map api only once
  function initialSetup() {
    signupFormSrollContent.focus();
    let scriptTags = document.getElementsByTagName("script");
    let isMapApiIncluded = false;
    for(let i=0; i < scriptTags.length; i++) {
        if(/https:\/\/maps\.googleapis\.com/.test(scriptTags[i].getAttribute("src"))){
          isMapApiIncluded = true;
        }
    }
    if(!isMapApiIncluded) {
      let scriptTag = document.createElement('script');
      scriptTag.src =
          'https://maps.googleapis.com/maps/api/js?key=AIzaSyDw2kzk7w6Qquegqreg2CaiKmFUyMKO1FM' +
              '&libraries=places&callback=initAutoCompleteSignUpFloating';
      bodyTag.appendChild(scriptTag);
    }

    //Fire Ampush and Safari Tracker for floating form
      let intervalObj = setInterval(function() {
        if (window.isUTMContentLoad) {
          ampt.pageview(window.getUtmParams());
          ampt.track('Apply1FloatingForm', window.getUtmParams());

          safariAmpt.pageview(window.getUtmParams());
          safariAmpt.track('applyOneFloatingForm', window.getUtmParams());
          clearInterval(intervalObj);
        }
    }, 200);
    //End Fire Ampush Tracker
  }

  function animateUp(e) {
    
    if(!isFormOpenedOnce) {
      isFormOpenedOnce = true;
      initialSetup();
    }

    isFloatEnabled = cta_floating.getAttribute("data-isFloatFormEnabled");

    //enable href in desktop/tab view
    if(window.innerWidth <= 480 && Number(isFloatEnabled)){
      e.preventDefault();
    }
    else {
      return;
    }

    //add/remove hide class to form
    if (form_floating.classList.contains(SignUpFormFloatingClass.HIDE)) {
      pos = document.documentElement.scrollTop || document.body.scrollTop;
      overlay.classList.remove(SignUpFormFloatingClass.HIDDEN);
      setTimeout(function() {
        overlay.classList.add(SignUpFormFloatingClass.BLACK);
      },50);
      form_floating.classList.remove(SignUpFormFloatingClass.HIDE);
      setTimeout(function() {
        html.classList.add(SignUpFormFloatingClass.HIDE_OVERFLOW);
        body.classList.add(SignUpFormFloatingClass.HIDE_OVERFLOW);
      },400);
    } else {
      body.classList.remove(SignUpFormFloatingClass.HIDE_OVERFLOW);
      html.classList.remove(SignUpFormFloatingClass.HIDE_OVERFLOW);
      document.documentElement.scrollTop = document.body.scrollTop = pos;
      setTimeout(function() {
        overlay.classList.add(SignUpFormFloatingClass.HIDDEN);
      },400);
      overlay.classList.remove(SignUpFormFloatingClass.BLACK);
      form_floating.classList.add(SignUpFormFloatingClass.HIDE);
    }
  }
}
