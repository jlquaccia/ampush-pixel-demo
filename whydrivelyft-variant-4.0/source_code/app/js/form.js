import { formatNumber } from '../js/format-number.js';
import { trackPixel } from '../js/pixel-tracker.js';
import * as utmAPI from '../js/utm-api.js';

if (!window._babelPolyfill) {
  require("babel-polyfill");
}

/**
 * Form classes.
 * @private @enum {string}
 */
const FormClasses = {
  LABEL: 'intro__label--update',
  ERROR: 'intro__field--err',
  AGREE_ERR: 'intro__agree-error'
};

/**
 * Handles Form functionality.
 */
export function Form() {
  let inputEls = document.getElementsByClassName('intro__field');
  let nextBtn = document.getElementsByClassName('intro__btn-next')[0];
  let phoneEl = document.getElementById('phone');
  let agreeTermsEl = document.getElementsByClassName('intro__agree')[0];
  let submitBtn = document.getElementsByClassName('intro__btn-submit')[0];
  let checkBoxEl = document.getElementById('agree-terms');
  let phoneField = document.getElementById('phone');
  let telNumber = 0;
  let phonePixelFired = false;
  let emailObj = {};
  let typeingTimer;

  nextBtn.addEventListener('click', verifyNumber, false);
  phoneField.addEventListener('keyup', handleKeyPress, false)

  for (let i = 0;i < inputEls.length;i++) {
    if(inputEls[i].value !== "") {
      let label = inputEls[i].previousSibling;
      label.classList.add(FormClasses.LABEL);
    }
    inputEls[i].addEventListener('focus', updateLabel, false);
    inputEls[i].addEventListener('focusout', updateLabel, false);
  }


  new formatNumber(phoneEl);

  /**
   * Fires pixel when user enters phone nunber
   */
   function handleKeyPress(e) {
     let char= phone.value.length;
     if (!phonePixelFired) {
       if (char != 0 && char >= 1) {
         ampt.track('applyOnePhoneNumberEntered', utmAPI.default.getUtmParams());
         safariAmpt.track("applyonephonenumberentered", utmAPI.default.getUtmParams());
       }
       phonePixelFired = true;
     }
   }

  /**
   * Verifies phone number.
   *
   * @param {!Event} e event object.
   */
  function verifyNumber(e) {
    e.preventDefault();
    let inputNo = phoneEl.value.replace(/\D/g,'');

    checkBoxEl.addEventListener('click', function (e) {
      let errorEl = document.getElementsByClassName(FormClasses.AGREE_ERR)[0];
      if (errorEl) {
        if (e.target.checked) {
          errorEl.style.display = 'none';
        } else {
          errorEl.style.display = 'block';
        }
      }
    }, false);

    if ((inputNo.length == 10 || inputNo.length == 11) && checkBoxEl.checked) {
      removeErrClass(phoneEl);

      // API call to check valid number.
      let xhttp = new XMLHttpRequest();
      xhttp.open('POST', 'https://apv.ampush.io/api/validate', true);
      xhttp.onload = function() {
        if (xhttp.status == 200) {
          if(JSON.parse(xhttp.response).status) {
            telNumber = inputNo;
            disableSubmit(nextBtn);
            ampt.track('ApplyOneNext', utmAPI.default.getUtmParams());
            ampt.track('ApplyNext', utmAPI.default.getUtmParams());
            safariAmpt.track('applyonenext', utmAPI.default.getUtmParams());
            handleResponse(JSON.parse(xhttp.response).status);
          } else {
            addErrClass(phoneEl);
          }
        }
      }

      xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhttp.send(JSON.stringify({'phone': inputNo}));
    } else {
      if (inputNo.length <= 8) {
        addErrClass(phoneEl);
      }
      createSpan();
    }
     //Checking after the submission of mobile number if the fields contains any value.
     for (let i = 0;i < inputEls.length;i++) {
      if(inputEls[i].value !== "") {
        let label = inputEls[i].previousSibling;
        label.classList.add(FormClasses.LABEL);
      }
    }
  }

  /**
   * Create Span element to show error for terms checkbox.
   */
  function createSpan() {
    if (!checkBoxEl.checked &&
        !document.getElementsByClassName(FormClasses.AGREE_ERR)[0]) {
          let spanEl = document.createElement('SPAN');
          spanEl.textContent = 'You must agree to the terms';
          spanEl.classList.add(FormClasses.AGREE_ERR);
          agreeTermsEl.appendChild(spanEl);
    }
  }

  /**
   * Disables button and cursor.
   *
   * @param {!Element} element Submit element.
   */
  function disableSubmit(element) {
    element.setAttribute('disabled', 'true');
    element.style.cursor = 'not-allowed';
  }

  /**
   * Handles response from API.
   *
   * @param {boolean} response Response from api.
   */
  function handleResponse(response) {
    if (response) {
      let otherFormDetails = document.getElementsByClassName('js-form');
      let titleHeader = document.getElementsByClassName('intro__title')[0];
      let bodyTag = document.getElementsByTagName('body')[0];
      let scriptTag = document.createElement('script');
      let termsEl = document.getElementsByClassName('js-terms')[0];
      let appliedEl = document.getElementsByClassName('js-applied')[0];
      let scriptTags = document.getElementsByTagName("script");
      let isMapApiIncluded = false;

      // Update tracking values for detail form.
      termsEl.setAttribute('data-track1', 'applyTwoTOS');
      appliedEl.setAttribute('data-track1', 'applyTwoAppStatus');

      for(let i=0; i < scriptTags.length; i++) {
          if(/https:\/\/maps\.googleapis\.com/.test(scriptTags[i].getAttribute("src"))){
            isMapApiIncluded = true;
          }
      }
      // Lazy loading of maps api.
      if(!isMapApiIncluded) {
        scriptTag.src =
            'https://maps.googleapis.com/maps/api/js?key=AIzaSyDw2kzk7w6Qquegqreg2CaiKmFUyMKO1FM' +
                '&libraries=places&callback=initAutoComplete';
        bodyTag.appendChild(scriptTag);
      }

      titleHeader.classList.add('intro__title--modify');
      submitBtn.addEventListener('click', checkValidations, false);

      for (let i = 0;i < otherFormDetails.length; i++) {
        otherFormDetails[i].style.display = 'block';
      }
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'block';

      //<!-- Ampush/Safari Tracker Pixel Code -->
        let initiative;
        let pid;

        // for safari pixel tracker
        if (/www.whydrivelyft.com/.test(window.location.href)) {
          pid = "e4c0c2b8-3c40-4963-9164-198a13f7689e";
          initiative = "753b86b1-8a5c-4ee9-8af6-dc90af3cf625";
        } else {
          pid = "a3564493-1c53-4767-a3c0-a9c9714fb9a0";
          initiative = "afef64b4-fde2-45b7-ad67-12127221e6dd";
        }

        !function(){
          var t=document.createElement('script');t.setAttribute('type','text/javascript');
          t.setAttribute('src',"//files.ampush.io/js/tracker2.1.js?"+(new Date).valueOf());
          'undefined'!=typeof t&&document.getElementsByTagName('head')[0].appendChild(t);
          t.onload=function(){ampt.init('lyft', 'ce4c0c2b8-3c40-4963-9164-198a13f7689e');ampt.pageview(utmAPI.default.getUtmParams());ampt.track('Apply2', utmAPI.default.getUtmParams());safariAmpt.init(pid, initiative);safariAmpt.track('applytwopageview', utmAPI.default.getUtmParams());}
        }();
      //<!-- DO NOT MODIFY Ampush/Safari Tracker Pixel Code -->
    } else {
      addErrClass(phoneEl);
      updateElement(nextBtn);
    }
  }

  /**
   * Update element properties.
   *
   * @param {!Element} element html element.
   */
  function updateElement(element) {
    element.removeAttribute('disabled', 'true');
    element.style.cursor = 'pointer';
  }

  /**
   * Checks Form validations.
   *
   * @param {!Event} e event object.
   */
  async function checkValidations(e) {
    e.preventDefault();
    let isValidData = [];
    let userData = '{}';
    var userInputobj  = JSON.parse(userData);
    let value = phoneEl.value.replace(/\D/g,'');
    let inputEls = document.querySelectorAll('.intro__field');
    let latEl = document.getElementById('lat');
    let lngEl = document.getElementById('lng');

    for (let i = 0;i < inputEls.length; i++) {
      // Validation for first and last name.
      if (inputEls[i].value === '' && inputEls[i].id != 'code' && inputEls[i].id != 'region') {
        addErrClass(inputEls[i]);
        isValidData.push(false);
      } else if (inputEls[i].id == 'email') {
        var emailStatus = await checkValidEmail(inputEls[i]);

        if (!emailStatus) {
          isValidData.push(false);
        } else {
          userInputobj[inputEls[i].name] = inputEls[i].value;
        }
      } else if (inputEls[i].id == 'region') {

        // Validation whether region selected from maps api.
        if (window.isCitySelected && (window.cityName === inputEls[i].value)) {
          //userInputobj[inputEls[i].name] = inputEls[i].value;
          userInputobj[latEl.name] = latEl.value;
          userInputobj[lngEl.name] = lngEl.value;

        } else {
          addErrClass(inputEls[i]);
          isValidData.push(false);
        }
      } else if (inputEls[i].id == 'code') {
          userInputobj[inputEls[i].name] = inputEls[i].value;
      } else {
          userInputobj[inputEls[i].name] = inputEls[i].value;
        }
      inputEls[i].addEventListener('keyup', watchInput);
      inputEls[i].addEventListener('keydown', function() {
        clearTimeout(typeingTimer);
      });
    }

    if (value.length <= 8) {
      addErrClass(phoneEl);
    }
    createSpan();

    var url = location.search.substring(1);
    var queryStringObj = JSON.parse('{"' + decodeURI(url).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

    userInputobj['code'] = queryStringObj.code || 'AMP200FB';
    userInputobj['utm_campaign'] = queryStringObj.utm_campaign || '';
    userInputobj['adgroup'] = queryStringObj.adgroup || '';
    userInputobj['ad'] = queryStringObj.ad || '';
    userInputobj['utm_content'] = queryStringObj.utm_content || '';
    userInputobj['utm_term'] = queryStringObj.utm_term || '';

    if (checkBoxEl.checked == true &&
        isValidData.length == 0 && (value.length == 10 || value.length == 11)) {
      //Adds terms parameter true.
      userInputobj['agree_to_terms'] = 'true';
      //Adds utm parameter ampush.
      userInputobj['utm_source'] = 'ampush';
      new trackPixel();
      disableSubmit(submitBtn);
      removeErrClass(phoneEl);

      // API call to check valid number.
      let xhttp = new XMLHttpRequest();
      xhttp.open('POST', 'https://apv.ampush.io/api/validate', true);
      xhttp.onload = function() {
        if (xhttp.status == 200) {
          if (JSON.parse(xhttp.response).status) {
            let phoneElValue = phoneEl.value;
            //If no have value 1 remove for backend purpose.
            if (value[0] === '1') {
              userInputobj[phoneEl.name] = phoneElValue.replace(" ","").slice(2).trim();
             } else {
               userInputobj[phoneEl.name] = phoneElValue.trim();
             }
            sendFormDetails(userInputobj);
          } else {
            addErrClass(phoneEl);
            updateElement(submitBtn);
          }
        }
      }

      xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhttp.send(JSON.stringify({'phone': value}));
    } else {
      isValidData.push(false);
    }
  }


  /**
   * Send form details to Ampush tracker and set the url.
   *
   * @param {!Object<string, string>} userInputobj User input data.
   */
  function sendFormDetails(userInputobj) {
    const phone = userInputobj.phone.replace(/[^\d]/g,'');
    const body = {
      phone: userInputobj.phone,
      first_name: userInputobj.first_name,
      last_name: userInputobj.last_name,
      email: userInputobj.email,
      utm_campaign: userInputobj.utm_campaign,
      utm_content: userInputobj.utm_content,
      utm_term: userInputobj.utm_term,
      utm_source: userInputobj.utm_source,
      code: userInputobj.code,
      location_latitude:  parseFloat(userInputobj.location_latitude),
      location_longitude: parseFloat(userInputobj.location_longitude)
    }

    const url = 'https://www.lyft.com/api/driverapplicant';
    const successRedir = 'https://www.lyft.com/drivers/apply/step/verify-phone';
    const failedRedir = `https://www.lyft.com/auth?next=https://www.lyft.com/drivers/apply/resume&pn=1${phone}`;

    const request = new XMLHttpRequest();

    request.onload = function() {
      const data = JSON.parse(this.response);

      if (this.status === 201) {
        userInputobj['applicant_id'] = data._id;
        userInputobj['utm_applicant_id'] = data._id;
        userInputobj['utm_applicant_status'] = 'New';
        ampt.track('user_details', utmAPI.default.getUtmParams(userInputobj));
        ampt.track('NewApplicant', utmAPI.default.getUtmParams(userInputobj));
        safariAmpt.track('leadaccepted', window.getUtmParams(userInputobj));
        safariAmpt.track('newapplicant', window.getUtmParams(userInputobj));
        window.location.href = successRedir;

      } else if (this.status === 422) {
        userInputobj['applicant_id'] = '-' + window.ampt.uid;
        userInputobj['utm_applicant_id'] = '-' + window.ampt.uid;
        userInputobj['utm_applicant_status'] = 'Existing';
        ampt.track('user_details', utmAPI.default.getUtmParams(userInputobj));
        ampt.track('ExistingApplicant', utmAPI.default.getUtmParams(userInputobj));
        safariAmpt.track('leadaccepted', window.getUtmParams(userInputobj));
        safariAmpt.track('existingapplicant', window.getUtmParams(userInputobj));
        window.location.href= failedRedir;

      } else if (this.status === 500) {
        var flashMessage = document.querySelector('.signup__flash-message');
        flashMessage.style.display = 'block';
        ampt.track('LyftAPI500Error', utmAPI.default.getUtmParams(userInputobj));
        safariAmpt.track('LyftAPIFiveHundredError', window.getUtmParams(userInputobj));
      } else {
        userInputobj['applicant_id'] = '-' + window.ampt.uid;
        userInputobj['utm_applicant_id'] = '-' + window.ampt.uid;
        ampt.track('user_details', utmAPI.default.getUtmParams(userInputobj));
        safariAmpt.track('leadaccepted', window.getUtmParams(userInputobj));
        window.location.href= failedRedir;
      }
    };

    request.open('POST', url, true);
    request.setRequestHeader('Content-type', 'application/json');
    request.withCredentials = true;
    request.send(JSON.stringify(body));
  }

  /**
   * Monitors user input and accordingly display errer message.
   *
   * @param {!Event} e event object.
   */
  function watchInput(e) {
    switch (e.target.id) {
      case 'first-name':
        updateState(e.target);
        break;
      case 'last-name':
        updateState(e.target);
        break;
      case 'email':
        clearTimeout(typeingTimer);
        typeingTimer = setTimeout(function() {checkValidEmail(e.target);}, 1000);
        break;
      case 'region':
        updateState(e.target);
        break;
    }
  }

  /**
   * Checks email validation.
   *
   * @param {!Element} element input field.
   * @return {boolean} Returns false if email api returns error.
   */
  async function checkValidEmail(element) {
    var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegExp.test(element.value)) {
      addErrClass(element);
      return false;
    } else {
      await emailPromise(element.value);

      if (emailObj[element.value]) {
        removeErrClass(element);
        return true;
      } else {
        addErrClass(element);
        return false;
      }
    }
  }

  /**
   * Show/hide error messages.
   *
   * @param {!Element} element input field.
   */
  function updateState(element) {
    if (element.value != '') {
      removeErrClass(element);
    } else {
      addErrClass(element);
    }
  }

  /**
   * Adds class to label element to show animation.
   *
   * @param {!Event} e Event object.
   */
  function updateLabel(e) {
    let label = e.target.previousSibling;
    if (!label.classList.contains(FormClasses.LABEL)) {
      label.classList.add(FormClasses.LABEL);
    } else if (phoneEl.value === '') {
      label.classList.remove(FormClasses.LABEL);
    } else {
      if (e.target.value === '') {
        label.classList.remove(FormClasses.LABEL);
      }
    }
  }

  /**
   * Adds class to element.
   *
   * @param {!Element} element input field.
   */
  function addErrClass(element) {
    element.classList.add(FormClasses.ERROR);
    element.nextElementSibling.style.display = 'block';
  }

  /**
   * Removes class from element.
   *
   * @param {!Element} element input field.
   */
  function removeErrClass(element) {
    element.classList.remove(FormClasses.ERROR);
    element.nextElementSibling.style.display = 'none';
  }

  /**
   * Determines whether email is valid or not
   *
   * @param {!Element} element input field.
   */
  function emailPromise(element) {
    return new Promise(function(resolve, reject) {
      // API call to check valid email.
      let xhttp = new XMLHttpRequest();
      let url = location.hostname === 'www.whydrivelyft.com' || location.hostname === 'try.whydrivelyft.com'
          ? 'https://payments.ampush.io/validate/email?noerrors=1'
          : 'https://payments.ampush.io/validate/email'

      xhttp.open('POST', url, true);

      xhttp.onerror = xhttp.ontimeout = xhttp.onload = function() {
        if (xhttp.readyState === 4 && xhttp.status !== 0) { // check to make sure the payments email validation api isn't down
          if ((xhttp.status === 200)) {
            emailObj[element] = true;
            resolve(true);
          } else {
            emailObj[element] = false;
            resolve(false);
          }
        } else {
          // something is wrong with payments email validation endpoint, don't use it
          emailObj[element] = true;
          resolve(true);
        }
      }

      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send(JSON.stringify({"value": element}));
    });
  }
}
