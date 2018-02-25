/*========================================================================================================*/
// utmAPI
/*========================================================================================================*/

var utmAPI = {
  getUtmParams: function(customParamsObj) {
    // ex. customParamsObj
    // {propName: 'value'}

    var utmParamsArr = ['utm_source', 'utm_campaign', 'adgroup', 'ad', 'utm_content', 'utm_term', 'code', 'utm_aid', 'cvosrc', 'utm_variant'];
    var utmParamsObj = {};
    var key;
    var value;

    if (customParamsObj) {
      for (const prop in customParamsObj) {
        key = prop;
        value = customParamsObj[prop];

        utmParamsObj[key] = value;
      }
    }

    for (var i = 0; i < utmParamsArr.length; i++) {
      key = utmParamsArr[i];
      value = getQueryVariable(utmParamsArr[i]);

      utmParamsObj[key] = value;
    }

    return utmParamsObj;
  }
}

/*========================================================================================================*/
// private functions
/*========================================================================================================*/

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");

  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");

    if(pair[0] == variable){return pair[1];}
  }

  return(false);
}

/*========================================================================================================*/
// add getUtmParams method to window object so it is available on within script tags on html pages for ampush pageview pixels
/*========================================================================================================*/

(function() {
	window.getUtmParams = utmAPI.getUtmParams;
})();

/*========================================================================================================*/
// make utmParams available site wide
/*========================================================================================================*/

export default {
	getUtmParams: utmAPI.getUtmParams
}
