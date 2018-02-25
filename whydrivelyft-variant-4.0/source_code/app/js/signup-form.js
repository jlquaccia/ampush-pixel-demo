import { formatNumberSignUp } from '../js/format-number-signup.js';
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
  LABEL: 'signup__label--update',
  ERROR: 'signup__field--err',
  AGREE_ERR: 'signup__agree-error'
};

/**
 * Handles Form functionality.
 */
export function SignUpForm() {
  let inputEls = document.getElementsByClassName('signup__field');
  let phoneEl = document.getElementById('signup-phone');
  let agreeTermsEl = document.getElementsByClassName('signup__agree')[0];
  let submitBtn = document.getElementsByClassName('signup__btn-submit')[0];
  let checkBoxEl = document.getElementById('agree-signup-terms');
  let telNumber = 0;
  let isNumberValid = false;
  let emailObj = {};
  let typeingTimer;

  if(getCookieValue('phone')) {
    phoneEl.value = getCookieValue('phone');
    document.cookie = 'phone' + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.whydrivelyft.com;path=/'; //delete cookie after autofill
  }

  for (let i = 0;i < inputEls.length;i++) {
    if(inputEls[i].value !== "") {
      let label = inputEls[i].previousSibling;
      label.classList.add(FormClasses.LABEL);
    }
    inputEls[i].addEventListener('focus', updateLabel, false);
    inputEls[i].addEventListener('focusout', updateLabel, false);
  }
  submitBtn.addEventListener('click', checkValidations, false);
  checkBoxEl.addEventListener('click', validateCheckBox, false);
  new formatNumberSignUp(phoneEl);

  function validateCheckBox() {
    createSpan();
    let errorEl = document.getElementsByClassName(FormClasses.AGREE_ERR)[0];
    if (errorEl) {
      if (checkBoxEl.checked) {
        errorEl.style.display = 'none';
      } else {
        errorEl.style.display = 'block';
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
    let inputEls = document.querySelectorAll('.signup__field');
    let latEl = document.getElementById('signup-lat');
    let lngEl = document.getElementById('signup-lng');

    validateCheckBox();

    for (let i = 0;i < inputEls.length; i++) {

      // Validation for first and last name.
      if (inputEls[i].value === '' && inputEls[i].id != 'signup-code' && inputEls[i].id != 'signup-region') {
        addErrClass(inputEls[i]);
        isValidData.push(false);
      } else if (inputEls[i].id == 'email') {
        // Validation email address.
        var emailStatus = await checkValidEmail(inputEls[i]);
        
        if (!emailStatus) {
          isValidData.push(false);
        } else {
          userInputobj[inputEls[i].name] = inputEls[i].value;
        }
      } else if (inputEls[i].id == 'signup-region') {
        // Validation whether signup-region selected from maps api.
        if (window.isCitySelected && (window.cityName === inputEls[i].value)) {
          //userInputobj[inputEls[i].name] = inputEls[i].value;
          userInputobj[latEl.name] = latEl.value;
          userInputobj[lngEl.name] = lngEl.value;
        } else {
          addErrClass(inputEls[i]);
          isValidData.push(false);
        }
      } else if (inputEls[i].id == 'signup-code') {
          userInputobj[inputEls[i].name] = inputEls[i].value;
      } else {
          userInputobj[inputEls[i].name] = inputEls[i].value;
        }
      inputEls[i].addEventListener('keyup', watchInput);
      inputEls[i].addEventListener('keydown', function() {
        clearTimeout(typeingTimer);
      });
    }

    if(value.length < 10){
      addErrClass(phoneEl);
    }

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
   * Monitors user input and accordingly display error message.
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
      case 'signup-region':
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
    }else {
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
   * Get cookie value, for checking 
   * if phone should be autofilled.
   * 
   */
  function getCookieValue(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
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
