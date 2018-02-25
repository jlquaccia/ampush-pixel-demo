import * as utmVariants from '../js/utm-variants.js';

// utm variant logic relies on the folder structures on TRY and WWW having r3 an r4 folders in the root (otherwise code will break)
let utmVariantsObj = utmVariants.default;
let currentVariant = location.href.split('/').splice(3).join('/').split('?')[0].toString();

let DEFAULT_PARAMETERS = ['utm_source=ampush', 'utm_campaign=PAID_DAX_SOC_US_ALL_ALL_092017_NEW_AMPUSH', 'adgroup=ALL_ALL_ALL_SFO_AMP_ALL_21-65', 'ad=AMP_NA_NA_Content_SO-500', 'utm_content=amp_kw4wV411o4At7yT2kBbqDzxE3WsHykURueS_9skOZ7o', 'utm_term=DR', 'code=AMP500FB', 'utm_aid=amp_kw4wV411o4At7yT2kBbqDzxE3WsHykURueS_9skOZ7o', 'cvosrc=aggregator.ampush.PAID_DAX_SOC_US_ALL_ALL_092017_NEW_AMPUSH', 'utm_variant='+utmVariantsObj[currentVariant]];
const UTM_PARAMS = ['utm_source', 'utm_campaign', 'adgroup', 'ad', 'utm_content', 'utm_term', 'code', 'utm_aid', 'cvosrc', 'utm_variant'];
const VALID_UTM_SOURCE = ['ampush'];

const ParamDefaultOrder = ['utm_source', 'utm_content','code','utm_campaign','UTM_TERM','utm_term','adgroup','ad', 'cvosrc', 'utm_variant'];

const DefaultParams = {
  UTM_SOURCE: 'ampush',
  UTM_CONTENT: 'amp_kw4wV411o4At7yT2kBbqDzxE3WsHykURueS_9skOZ7o',
  CODE: 'AMP500FB',
  UTM_CAMPAIGN: 'PAID_DAX_SOC_US_ALL_ALL_092017_NEW_AMPUSH',
  UTM_TERM: 'DR',
  UTM_AID: 'amp_kw4wV411o4At7yT2kBbqDzxE3WsHykURueS_9skOZ7o',
  ADGROUP: 'ALL_ALL_ALL_ALL_AMP_ALL_21-65',
  AD: 'AMP_NA_NA_Content_SO-500',
  CVOSRC: 'aggregator.ampush.',
  UTM_VARIANT: utmVariantsObj[currentVariant]
};

const domain = location.hostname === 'www.whydrivelyft.com' || location.hostname === 'try.whydrivelyft.com' ? '.whydrivelyft.com' : 'localhost'; // handles setting utm cookies in development
const codeId = document.getElementById('code');
const signupCodeId = document.getElementById('signup-code');


let tracker_IE = ""; //PERF-448 fix.
let queryString;

export function utmTracker() {
  if ((location.pathname.indexOf('index.html') == -1) && (location.pathname.indexOf('index-') == -1)) { //if page is Something other than index.html or index personal pages change to content
    DefaultParams.UTM_TERM = 'content';
    DEFAULT_PARAMETERS = ['utm_source=ampush', 'utm_campaign=PAID_DAX_SOC_US_ALL_ALL_092017_NEW_AMPUSH', 'adgroup=ALL_ALL_ALL_SFO_AMP_ALL_21-65', 'ad=AMP_NA_NA_Content_SO-500', 'utm_content=amp_kw4wV411o4At7yT2kBbqDzxE3WsHykURueS_9skOZ7o', 'utm_term=content', 'code=AMP500FB', 'utm_aid=amp_kw4wV411o4At7yT2kBbqDzxE3WsHykURueS_9skOZ7o', 'cvosrc=aggregator.ampush.PAID_DAX_SOC_US_ALL_ALL_092017_NEW_AMPUSH', 'utm_variant=' + utmVariantsObj[currentVariant]];
  }

  function setQueryStringParamsOnRefresh() {
    // setting promo code to code input field if promo exists.
    queryString = location.search.substr(1).replace(/%/g, "");
    let pairs = queryString.split('&');
    let result = {};
    pairs.forEach(function (pair) {
      if(pair.indexOf('7fh285_auid') != -1){
        tracker_IE = pair;
      }
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
    });

    // Checks if has URL parameters.
    if (result.code) {
      switch (result.code) {
        case 'AMP200G':
        case 'AMP200FB':
        case 'AMP350FB':
        case 'AMP350G':
        case 'AMP500G':
        case 'AMP500FB':
          if (codeId) {
            codeId.value = result.code;
          }

          if (signupCodeId) {
            signupCodeId.value = result.code;
          }

          document.cookie = 'code=' + result.code + ";domain=" + domain + ";path=/";
          break;
        default:
          if (codeId) {
            codeId.value = DefaultParams.CODE;
          }

          if (signupCodeId) {
            signupCodeId.value = DefaultParams.CODE;
          }

          document.cookie = 'code=' + DefaultParams.CODE + ";domain=" + domain + ";path=/";
      }

      // Removed the following line which sets the label to blank.
      //  document.querySelector('label[name=code]').innerHTML = '';
      if (codeId) {
        codeId.style.background = '#d8dce6';
        codeId.style.cursor = 'no-drop';
      }
      
      if (signupCodeId) {
        signupCodeId.style.background = '#d8dce6';
        signupCodeId.style.cursor = 'no-drop';
      }
    } else {
      let cookieValue = getCookieValue('code');

      if (!cookieValue) {
        cookieValue = DefaultParams.CODE;
      }
      
      setCookie('code=' + cookieValue, false);

      if (codeId) {
        codeId.value = cookieValue;
        codeId.style.background = '#d8dce6';
        codeId.style.cursor = 'no-drop';
      }

      if (signupCodeId) {
        signupCodeId.value = cookieValue;
        signupCodeId.style.background = '#d8dce6';
        signupCodeId.style.cursor = 'no-drop';
      }
    }

    // set utm_campaign & cvosrc param based on first page visit
    if (result.utm_campaign) {
      setCookie('utm_campaign=' + result.utm_campaign, false);
      setCookie('cvosrc=' + DefaultParams.CVOSRC + result.utm_campaign, false);
    } else {
      let cookieValue = getCookieValue('utm_campaign');
      if (!cookieValue) {
        cookieValue = DefaultParams.UTM_CAMPAIGN;
      }
      setCookie('utm_campaign=' + cookieValue, false);
    }

    // set cvosrc param based on first page visit
    if (result.cvosrc) {
      if(result.cvosrc = DefaultParams.CVOSRC + result.utm_campaign) {
        setCookie('cvosrc=' + result.cvosrc, false);
      } else {
        setCookie('cvosrc=' + DefaultParams.CVOSRC + result.utm_campaign, false);
      }
    } else {
      let cookieValue = getCookieValue('cvosrc');
      if (!cookieValue) {
        cookieValue = DefaultParams.CVOSRC + DefaultParams.UTM_CAMPAIGN;
      }
      setCookie('cvosrc=' + cookieValue, false);
    }

    // set adgroup param based on first page visit
    if (result.adgroup) {
      setCookie('adgroup=' + result.adgroup, false);
    } else {
      let cookieValue = getCookieValue('adgroup');
      if (!cookieValue) {
        cookieValue = DefaultParams.ADGROUP;
      }
      setCookie('adgroup=' + cookieValue, false);
    }

    // set ad param based on first page visit
    if (result.ad) {
      setCookie('ad=' + result.ad, false);
    } else {
      let cookieValue = getCookieValue('ad');
      if (!cookieValue) {
        cookieValue = DefaultParams.AD;
      }
      setCookie('ad=' + cookieValue, false);
    }

    //if value of utm_term is content dont revert to DR, keep it same.
    let utm_term = getCookieValue('utm_term');
    if (utm_term != 'content') {
      setCookie('utm_term=' + DefaultParams.UTM_TERM, false);
    }

    //if user is directly coming to index page with content as utm_term change it to content.
    if(result.utm_term && result.utm_term=='content'){
      setCookie('utm_term=' + 'content', false);
    }

    // set source param based on first page visit
    if (result.utm_source !== DefaultParams.UTM_SOURCE && result.utm_source !== undefined) {
      setCookie('utm_source=ampush', false);
    } else {
      let cookieValue = getCookieValue('utm_source');
      if (!cookieValue) {
        cookieValue = DefaultParams.UTM_SOURCE;
      }
      setCookie('utm_source=' + cookieValue, false);
    }

    // set utm_aid param based on first page visit
    if (result.utm_aid) {
      setCookie('utm_aid=' + result.utm_aid, false);
    } else {
      let cookieValue = getCookieValue('utm_aid');
      if (!cookieValue) {
        cookieValue = DefaultParams.UTM_AID;
      }
      setCookie('utm_aid=' + cookieValue, false);
    }

    // set utm_content param based on first page visit
    if (result.utm_content) {
      setCookie('utm_content=' + result.utm_content, false);
    } else {
      let cookieValue = getCookieValue('utm_content');
      if (!cookieValue) {
        cookieValue = DefaultParams.UTM_CONTENT;
      }
      setCookie('utm_content=' + cookieValue, false);
    }

    // update utm_variant param on each page visit
    setCookie('utm_variant=' + utmVariantsObj[currentVariant], false);
  }

  setQueryStringParamsOnRefresh();

  if (queryString === '') {
    if (hasValidCookie()) {
      getValuesFromCookies();
    } else {
      setDefaultParams();
      queryString = getValuesFromCookies();
    }
    checkAmptuid(false);
    validateUTMContentAndSetCookies();
  } else {
    hasValidUTMSource();
    checkAmptuid(true);
  }
}
function checkAmptuid(setcookie) {
  if (!getCookieValue('amptuid')) {
    setTimeout(function () {
      checkAmptuid(setcookie);
    }, 1000); // Try to submit form after timeout
  } else {
    if (setcookie) {
      validateUTMContentAndSetCookies();
      setParamsToLinks();
      setCookie(queryString.split('&'), true);
    } else {
      setDefaultParameters();
      validateUTMContentAndSetCookies();
    }
  }
}

function validateUTMContentAndSetCookies() {
  let utm_content_val = searchQueryString(UTM_PARAMS[4]) || getCookieValue('utm_content');
  updateCodeValue();

  if (utm_content_val && (utm_content_val.split('-')[0] === getCookieValue('amptuid') || utm_content_val.split('-')[0] === getCookieValue('amptuid').split('-')[0])) { /* If Amptuid is already appended to utm_content*/
    setDefaultParameters();
    setParamsToLinks();

  }
  else if (!/^amp_/i.test( utm_content_val)) { /* If UTM_content is not encrypted*/
    if (utm_content_val != '') {
      encodeUTMParameter(utm_content_val, encodeUTMParameterCallback);
    } else {
      //Trigger tracker once UTM_CONTENT gets generated.
      window.isUTMContentLoad = true;
    }
  } else { /* If UTM_content is encrypted just concatenate with amptuid*/
    setUTMContent(utm_content_val, setUTMContentCallback);
  }
}
function encodeUTMParameterCallback() {
  setDefaultParameters();
  setParamsToLinks();
}
function setUTMContentCallback(utm_content_val) {
  document.cookie = 'utm_aid=' + utm_content_val + ";domain=" + domain + ";path=/";
  setDefaultParameters();
  setParamsToLinks();
}
function setUTMContent(utm_content_val, callbackFunction) {
  let value = getCookieValue('amptuid') + "-" + utm_content_val;
  setCookieValue('utm_content', value);
  callbackFunction(utm_content_val);
}
function updateCodeValue() {
  let code_val = searchQueryString('code');
  if (code_val) {
    setCookieValue('code', code_val);
  }
}

function setDefaultParameters() {
  let temp_string = getCookie().split("; ").filter(s => s != '');
  //removing the amptuid & _uetsid from the query parameter, but not from cookies.
  temp_string.forEach(function(string, idx) {
    if(string.indexOf('amptuid') > -1) {
      temp_string.splice(idx, 1);
    }
    if (string.indexOf('_uetsid') > -1) {
      temp_string.splice(idx, 1);
    }
  });

  queryString = temp_string.join("&");
  //Trigger tracker once UTM_CONTENT gets generated.
  window.isUTMContentLoad = true;
}

function getCookieValue(utm_key) {
  let cookieString = getCookie().split("; ");
  for (let val = 0; val < cookieString.length; val++) {
    let item = cookieString[val];
    let query_key = item.split("=")[0];
    let query_val = item.split("=")[1];
    if (utm_key == query_key) {
      return query_val
    }
  }
}

function setCookieValue(utm_key, utm_value) {
  let cookieString = getCookie().split(";");
  let newCookieString = "";
  for (let val = 0; val < cookieString.length; val++) {
    let item = cookieString[val];
    let cookie = item.split("=");
    let query_key = cookie[0];

    if (utm_key.trim() == query_key.trim()) {
      cookie[1] = utm_value;
      let cookie_value = cookie.join("=");
      newCookieString = newCookieString + "; " + cookie_value;
    } else {
      newCookieString = newCookieString + "; " + item;
    }
  }
  setCookie(newCookieString.split("; "), true);
}

function hasValidUTMSource() {
  let UTMKeys = queryString.split("&");
  let validFlag = false;
  for (let item in UTMKeys) {
    let utm_pair = UTMKeys[item];
    let utm_key = utm_pair.split("=")[0];
    if (utm_key == 'utm_source') {
      let utm_val = 'ampush'; //PERF-465 fix utm_source always be 'ampush'
      if (VALID_UTM_SOURCE.indexOf(utm_val)) {
        validFlag = true;
        setCookieValue('utm_source', utm_val);
        document.cookie = 'utm_source=' + utm_val + ";domain=" + domain + ";path=/";
        break;
      }
    }
  }

  if (!validFlag) {
    queryString = getCookie().split("; ").filter(s => s != '').join("&");
  }
}

function searchQueryString(key) {
  let splits = queryString.split('&');
  for (let val = 0; val < splits.length; val++) {
    let item = splits[val];
    if (key == item.split("=")[0]) {
      return item.split("=")[1]
    }
  }
}


function hasValidCookie() {
  var doc_cookies = getCookie().split(";");

  for (var cookie = 0; cookie < doc_cookies.length; cookie++) {
    if ('utm_source' == doc_cookies[cookie].trim().split("=")[0]) {
      return true;
    }
  }
  return false;
}

function getValuesFromCookies() {
  return getCookie().split("; ").filter(s => s != '').join("&");
}

function setDefaultParams() {
  setCookie(DEFAULT_PARAMETERS, true);
  return DEFAULT_PARAMETERS;
}

function setCookie(params, doExpires) {
  if (doExpires) {
    let date = new Date();
    let expires;

    date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
    expires = 'expires=' + date.toUTCString();
    params.forEach(function (param) {
      document.cookie = param + ';' + expires + ";domain=" + domain + ";path=/";
    });
  } else {
    document.cookie = params + ";domain=" + domain + ";path=/";
  }
}

function getCookie() {
  return decodeURIComponent(document.cookie);
}

function encodeUTMParameter(utm_campaign_val, callbackFunction) {
  let ampId;
  let validValue = [];
  let UTMParams = queryString.split("&");

  let xhttp = new XMLHttpRequest();
  xhttp.open('POST', 'https://ampid.ampush.io/translate?id=' + utm_campaign_val,
    true);
  xhttp.onload = function () {
    if (this.status == 200) {
      var campaignId = JSON.parse(xhttp.response).amp_id;
      document.cookie = 'utm_aid=' + campaignId + ";domain=" + domain + ";path=/";
      UTMParams.forEach(function (param) {
        let value = param.split('=');
        if (value[0] == UTM_PARAMS[4]) {
          let amptuid_val = getCookieValue('amptuid');
          value[1] = amptuid_val + "-" + campaignId;
          value = value.join("=");
          validValue.push(value);
        } else if (value[0] == UTM_PARAMS[7]) {
          value[1] = campaignId;
          value = value.join("=");
          validValue.push(value);
        } else {
          validValue.push(param)
        }
      });
      setCookie(validValue, true);
      callbackFunction(validValue);
      //Trigger tracker once UTM_CONTENT gets generated.
      window.isUTMContentLoad = true;
    } else {
      // Something went wrong (404 etc.)
      reject(new Error(this.statusText));
    }
  };
  xhttp.send();
}

function setParamsToLinks() {
  let validatedParams = queryString.split('&');
  validatedParams = validatedParams.filter(s => s != '').join('&'); //to remove extra space getting added while saving in cookies in production
  //validatedParams =  reorderQueryString(validatedParams); //get reorderd queryString before appending it

  let pageUrl = "";
  //if (location.href.indexOf('?') !== -1) {
    pageUrl = location.href.split('?')[0] + '?' + validatedParams;
  // } else {
  //   pageUrl = location.href;
  // }
  if(tracker_IE){//PERF-448 fix.
    pageUrl = pageUrl + '&' + tracker_IE;
  }

  let anchorEls = document.querySelectorAll('.js-tracker');
  for (let i = 0; i < anchorEls.length; i++) {
    anchorEls[i].href = /\?$/.test(anchorEls[i].href) ? anchorEls[i].href +
      validatedParams : anchorEls[i].href + '&' + validatedParams;
  }
  window.history.replaceState({ urlPath: pageUrl }, '', pageUrl);
}

/**
 * Reorder for Query parameters, as mentioned order
 * @param {*} validatedParams
 */
function reorderQueryString(validatedParams){
  let tempArray = {};
  for(let i = 0 ; i < validatedParams.length;i++){
    let param = validatedParams[i].split('=');
    tempArray[param[0]]  = param[1];
  }
  let newQueryString =  ParamDefaultOrder[0] + "=" + tempArray[ParamDefaultOrder[0]];
  for (let i = 1; i < ParamDefaultOrder.length; i++) {
    newQueryString = newQueryString +"&" + ParamDefaultOrder[i] + "=" + tempArray[ParamDefaultOrder[i]] ;
  }
  return newQueryString;
}
