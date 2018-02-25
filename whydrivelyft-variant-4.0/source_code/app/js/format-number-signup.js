/**
 * Input field error class.
 * @private {string}
 */
const ERROR_CLASS = 'signup__field--err';

/**
 * Input field error class.
 * @private {string}
 */
const DIGITS_ONLY_REGEX = /\D/g;

/**
 * Formats the number according to US type.
 *
 * @param {!Element} inputEl Input field where phone number is entered.
 */
export function formatNumberSignUp(inputEl) {
  let acceptOneOnce = '';
  let storeOtherKeys = '';
  let isPlusOneFormat = false;

  inputEl.addEventListener('keypress', checkKey, false);
  inputEl.addEventListener('keydown', deleteKey, false);

  /**
   * Checks whether the keyboard input is digits only and disable
   * other keys.
   *
   * @param {!Event} e event object.
   */
  function checkKey(e) {

    let value = e.target.value.replace(DIGITS_ONLY_REGEX,'');
    let newValue = '';

    // Remove error class on input from user.
    if (value.length == 10 || value.length == 11) {
      removeErrClass(e.target);
    }

    // Check for digits only and accepts either 10 or 11 digits number.
    if ((e.which >= 48 && e.which <= 57) && value.length <= 10) {
      storeOtherKeys = storeOtherKeys + e.key;

      // This condition is require to accept only '1' once at start
      // of number.
      if (e.which == 49) {
        acceptOneOnce = acceptOneOnce + e.key;
        if (acceptOneOnce == storeOtherKeys && acceptOneOnce.length > 1) {
          e.preventDefault();
        } else {

          // Timeout is require as keypress event triggers before input is
          // available.
          setTimeout(function () {
            newValue = fomratNumber(e.target.value, e);
              if (newValue != e.target.value) {
                  e.target.value = newValue;
              }
          }, 0.5);
        }
      } else {
        setTimeout(function () {
          newValue = fomratNumber(e.target.value, e);
            if (newValue != e.target.value) {
                e.target.value = newValue;
            }
        }, 0.5);
      }
    } else {
      if (e.which != 8 && e.which != 118 && e.which != 0) {
        e.preventDefault();
      }
    }
  }

  /**
   * Checks for delete and backspace key and accordingly format the number.
   *
   * @param {!Event} e event object.
   */
  function deleteKey(e) {
    // Check for ctrl key.
    let ctrl = e.ctrlKey ? e.ctrlKey : ((e.which === 17) ? true : false);

    // For delete key shift caret focus to end of string and do nothing.
    if (e.which == 46) {
      let strLength = e.target.value.length;
      e.target.setSelectionRange(strLength, strLength);
      e.preventDefault();
    }

    // For backspace key remove the number with mask.
    // On ctrl + V key press, format the number in US format.
    if (e.which == 8 || (e.which == 86 && ctrl)) {
      setTimeout(function () {
        let value = e.target.value.replace(DIGITS_ONLY_REGEX,'');

        // Remove error class on ctrl+v of input from user.
        if (value.length == 10 || value.length == 11) {
          removeErrClass(e.target);
        }

        if (isPlusOneFormat || /^1/g.test(value)) {
          if (value.length >= 8) {
            value = value.replace(/^(\d)(\d{3})(\d{3})(\d{0,4}).*/,'+$1 ($2) $3-$4');
          } else if (value.length >= 5) {
            value = value.replace(/^(\d)(\d{3})(\d{0,3})/,'+$1 ($2) $3');
          } else if (value.length > 1) {
            value = value.replace(/^(\d)(\d{0,3})/, '+$1 ($2');
          } else if (value == '') {
            value = '';
            acceptOneOnce = value;
            storeOtherKeys = value;
            isPlusOneFormat = false;

          } else {
            value = value.replace(/^(\d*)/, '($1');
            storeOtherKeys = value.replace(DIGITS_ONLY_REGEX,'');
          }
        } else {
          if (value.length >= 7) {
            value = value.replace(/^(\d{3})(\d{3})(\d{0,4}).*/,'($1) $2-$3');
          } else if (value.length >= 4) {
            value = value.replace(/^(\d{3})(\d{0,3})/,'($1) $2');
          } else if (value == '') {
            value = '';
            storeOtherKeys = value.replace(DIGITS_ONLY_REGEX,'');
          } else {
            value = value.replace(/^(\d*)/, '($1');
          }
        }
        e.target.value = value;
      }, 0.5);
    }
  }

  /**
   * Format number according to US format i.e. +1 (xxx) xxx-xxxx or
   * (xxx) xxx-xxxx.
   *
   * @param {string} value number from input.
   */
  function fomratNumber(value) {
    value = value.replace(DIGITS_ONLY_REGEX, '');
    value = value.replace(/^0/, '');

    if (value == 1) {
      isPlusOneFormat = true;
    }

    // This condition is require if '1' is enter first so that number starts
    // with '+1'.
    if (isPlusOneFormat) {
      if (value.length > 6) {
        value = value.replace(/^(\d)(\d{3})(\d{3})(\d{0,4}).*/,'+$1 ($2) $3-$4');
      } else if (value.length > 4) {
        value = value.replace(/^(\d)(\d{3})(\d{0,3})/,'+$1 ($2) $3');
      } else if (value.length > 1) {
        value = value.replace(/^(\d)(\d{0,3})/, '+$1 ($2');
      } else {
        value = value.replace(/^(\d*)/, '($1');
      }
    } else {
      if (value.length > 5) {
        value = value.replace(/^(\d{3})(\d{3})(\d{0,4}).*/,'($1) $2-$3');
      } else if (value.length > 3) {
        value = value.replace(/^(\d{3})(\d{0,3})/,'($1) $2');
      } else {
        value = value.replace(/^(\d*)/, '($1');
      }
    }
    return value;
  }

  /**
   * Removes class from element.
   *
   * @param {!Element} element input field.
   */
  function removeErrClass(element) {
    element.classList.remove(ERROR_CLASS);
    element.nextElementSibling.style.display = 'none';
  }
}
