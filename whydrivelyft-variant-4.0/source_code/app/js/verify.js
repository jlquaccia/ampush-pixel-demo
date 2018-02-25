import { formatNumber } from '../js/format-number.js';

/**
 * Class to disable CTA.
 * @private {string}
 */
const CLASS_CTA_DISABLED = 'block__cta--disabled';

/**
 * Handles verification code functionality.
 */
export function verifyNumber() {
  let phoneNoDisplayEl = document.getElementById('phone-no');
  let resendCodeEl = document.getElementsByClassName('js-resend')[0];
  let verifyCodeInputEl = document.getElementsByClassName('block__verify-code')[0];
  let verificationBlockEl = document.getElementsByClassName('block__verification-code')[0];
  let resendBlockEl = document.getElementsByClassName('block__resend-verification-code')[0];
  let phoneNoInputEl = document.getElementsByClassName('block__resend-verify')[0];
  let errorMsgEl = document.getElementsByClassName('block__form-error')[0];
  let secondNextBtn = document.getElementById('next-2');
  let firstNextBtn = document.getElementById('next-1');

  let queryString = location.search.substr(1);
  let decodedString = unescape(decodeURI(queryString));
  let verifyNo = decodedString.split('&')[0].split('=')[1];

  phoneNoDisplayEl.textContent = verifyNo;
  phoneNoInputEl.value = verifyNo;
  resendCodeEl.addEventListener('click', resendCode, false);
  verifyCodeInputEl.addEventListener('keydown', keyCheck, false);
  verifyCodeInputEl.addEventListener('keyup', verifyCode, false);
  firstNextBtn.addEventListener('click', getVerificationCode, false);
  secondNextBtn.addEventListener('click', nextPage, false);

  new formatNumber(phoneNoInputEl);

  /**
   * Calls verification code API.
   *
   * @param {!Event} e event object.
   */
  function getVerificationCode(e) {
    e.preventDefault();
    let inputNo = phoneNoInputEl.value.replace(/\D/g,'');
    let phoneNo = {
      'phone': inputNo
    };
    setProperties(firstNextBtn);

    // API call to check valid number.
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'https://apv.ampush.io/api/sendotp', true);
    xhttp.onload = function() {
      if (xhttp.status == 200) {
        if (JSON.parse(xhttp.response).success) {
          resendBlockEl.style.display = 'none';
          verificationBlockEl.style.display = 'block';
          removeProperties(firstNextBtn);
        } else {
          removeProperties(firstNextBtn);
        }
      }
    }

    xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhttp.send(JSON.stringify(phoneNo));
  }

  /**
   * Triggers on key down to accept four values only.
   *
   * @param {!Event} e event object.
   */
  function keyCheck(e) {
    if (e.target.value.length > 3 && e.which != 8) {
      e.preventDefault();
    }
  }

  /**
   * Redirect the user to next step if input length is four or display error.
   *
   * @param {!Event} e event object.
   */
  function nextPage(e) {
    e.preventDefault();
    if (verifyCodeInputEl.value.length == 4) {
      verifyCode();
    } else {
      errorMsgEl.style.display = 'block';
    }
  }

  /**
   * Calls confirmation api and according redirect user or display error.
   *
   * @param {!Event} e event object.
   */
  function verifyCode(e) {
    errorMsgEl.style.display = 'none';
    if (e.target.value.length == 4) {
      e.preventDefault();
      setProperties(secondNextBtn);

      // API call to check valid number.
      let xhttp = new XMLHttpRequest();
      xhttp.open('GET', 'https://apv.ampush.io/api/confirm/' +
          verifyNo.replace(/\D/g,'') + '/' + e.target.value, true);
      xhttp.onload = function() {
        if (xhttp.status == 200) {
          if (JSON.parse(xhttp.response).success) {
              location.href = decodedString.split(/&(.+)/)[1].split(/=(.+)/)[1].replace(/&/,'?');
          } else {
            errorMsgEl.style.display = 'block';
            removeProperties(secondNextBtn);
          }
        }
      }

      xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      xhttp.send();
    }
  }

  /**
   * Shows phone number field to change the number and hide verification block.
   *
   * @param {!Event} e event object.
   */
  function resendCode(e) {
    e.preventDefault();
    resendBlockEl.style.display = 'block';
    verificationBlockEl.style.display = 'none';
  }

  /**
   * Removes properties of an element.
   *
   * @param {!Element} element html element obj.
   */
  function removeProperties(element) {
    element.classList.remove(CLASS_CTA_DISABLED);
    element.removeAttribute('disabled', 'true');
  }

  /**
   * Sets properties to an element.
   *
   * @param {!Element} element html element obj.
   */
  function setProperties(element) {
    element.classList.add(CLASS_CTA_DISABLED);
    element.setAttribute('disabled', 'true');
  }
}
