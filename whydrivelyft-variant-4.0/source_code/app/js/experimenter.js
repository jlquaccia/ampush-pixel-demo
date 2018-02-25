if (!window._babelPolyfill) {
  require("babel-polyfill");
}

window.addEventListener("load", function() {
  var funnelStep;
  var anchorEls = document.querySelectorAll('.experimenter');
  var queryParams = document.location.search[0] === '?' ? document.location.search : '?' + document.location.search;

  if (getCookieValue('index')) {
    // if user lands on a specific index on initial visit, continue to use that same index
    getRequestStatus().then(function(response) {
      if (location.pathname === '/' || location.pathname === '/index.html' || response !== 200) {
        window.location.replace(location.origin + getCookieValue('index') + queryParams);
      }

      for (var i = 0; i < anchorEls.length; i++) {
        anchorEls[i].href = location.origin + getCookieValue('index') + queryParams;
      }
    });
  } else {
    // remember initial funnel step that was used to persist experimenter's variant choice
    if (getCookieValue('funnelStep') && getCookieValue('funnelStep') !== 'undefined') {
      funnelStep = getCookieValue('funnelStep');
    } else {
      // select funnel step based on pathname
      switch(location.pathname) {
        case "/r1/blog-post-a-r1.html":
        case "/r1/blog-post-b-r1.html":
        case "/r1/blog-post-c-r1.html":
        case "/r1/driver-testimony-a.html":
        case "/r1/driver-testimony-b.html":
        case "/r1/driver-testimony-c.html":
        case "/r1/driver-testimony-d.html":
        case "/r1/driver-testimony-e.html":
        case "/r1/driver-testimony-f.html":
        case "/r1/driver-testimony-g.html":
        case "/r1/driver-promotion-a.html":
        case "/r1/driver-promotion-b.html":
        case "/r1/terms.html":
        case "/r2/5-ways-to-maximize-your-hourly-driving-with-lyft-hc-a.html":
        case "/r2/5-ways-to-maximize-your-hourly-driving-with-lyft-hc-b.html":
        case "/r2/tipping-hints-maximize-your-lyft-revenue-hc-a.html":
        case "/r2/tipping-hints-maximize-your-lyft-revenue-hc-b.html":
        case "/r2/10-best-cities-to-drive-for-lyft-hc-a.html":
        case "/r2/4-ways-make-new-city-home-hc-a.html":
        case "/r2/hitting-road-retirement-hc-a.html":
        case "/r2/driver-promotion-a.html":
        case "/r2/driver-promotion-b.html":
        case "/r2/terms.html":
        case "/r3/blog-post-a-r3.html":
        case "/r3/blog-post-b-r3.html":
        case "/r3/blog-post-c-r3.html":
        case "/r3/blog.html":
        case "/r4/5-ways-to-maximize-your-hourly-driving-with-lyft-hc-a.html":
        case "/r4/5-ways-to-maximize-your-hourly-driving-with-lyft-hc-b.html":
        case "/r4/tipping-hints-maximize-your-lyft-revenue-hc-a.html":
        case "/r4/tipping-hints-maximize-your-lyft-revenue-hc-b.html":
        case "/r4/10-best-cities-to-drive-for-lyft-hc-a.html":
        case "/r4/4-ways-make-new-city-home-hc-a.html":
        case "/r4/hitting-road-retirement-hc-a.html":
        case "/r4/driving-lyft-holiday-season-hc-a.html":
        case "/r4/why-more-people-freelance.html":
        case "/r4/how-to-skip-the-job-search-and-start-earning-fast.html":
        case "/r4/how-it-works.html":
        case "/r4/blog.html":
        case "/r4/testimony.html":
        case "/r4/faq.html":
        case "/r4/driver-testimony-a.html":
        case "/r4/driver-testimony-b.html":
        case "/r4/driver-testimony-c.html":
        case "/r4/driver-testimony-d.html":
        case "/r4/driver-testimony-e.html":
        case "/r4/driver-testimony-f.html":
        case "/r4/driver-testimony-g.html":
        case "/r4/driver-promotion-a.html":
        case "/r4/driver-promotion-b.html":
        case "/r4/terms.html":
          funnelStep = 'landing_page_blog_post_a';
          break;
        default:
          funnelStep = 'landing_page';
      }
    }
  }

  var experimenterUrl;

  if (/www.whydrivelyft.com/.test(window.location.href)){
    experimenterUrl= 'https:\/\/experimenter.ampush.io\/experimenter?partner_id=lyft&initiative=ce4c0c2b8-3c40-4963-9164-198a13f7689e&funnel_step=' + funnelStep;
  } else {
    experimenterUrl= 'https:\/\/experimenterqa.ampush.io\/experimenter?partner_id=lyft&initiative=ce4c0c2b8-3c40-4963-9164-198a13f7689e&funnel_step=' + funnelStep;
  }

  var userId = getCookieValue('amptuid') ? "&user_id=" + getCookieValue('amptuid') : '';

  /*
  * Asynchronously hits experimenterSignupFloatingUrl and enable disable floating form based on response
  */
  async function setFloatFormWorking() {
    var driver_cta = document.getElementsByClassName("fixed-cta-anchor")[0];

    if(driver_cta) {
      var floatFormCookie = getCookieValue("floatform");
      if(floatFormCookie) {
        if(floatFormCookie == '1') {
          driver_cta.setAttribute('data-isFloatFormEnabled','1');//form is enabled
        } else {
          driver_cta.setAttribute('data-isFloatFormEnabled','0');//form is disabled
        }
      } else {
        var enableFloatForm = await checkFloatForm();
        if(enableFloatForm) {
          driver_cta.setAttribute('data-isFloatFormEnabled','1');//form is enabled
          document.cookie = "floatform=1";
        } else {
          driver_cta.setAttribute('data-isFloatFormEnabled','0');//form is disabled
          document.cookie = "floatform=0";
        }
      }
    }
  }

  /**
  * Hit experimenter url for floating form
  */
  function checkFloatForm() {
    var experimenterSignupFloatingUrl;
    return new Promise(function(resolve, reject) {
      if (/www.whydrivelyft.com/.test(window.location.href)){
        experimenterSignupFloatingUrl= 'https://experimenter.ampush.io/experimenter?partner_id=lyft&initiative=ce4c0c2b8-3c40-4963-9164-198a13f7689e&funnel_step=floating_signup_form';
      } else {
        experimenterSignupFloatingUrl= 'https://experimenterqa.ampush.io/experimenter?partner_id=lyft&initiative=ce4c0c2b8-3c40-4963-9164-198a13f7689e&funnel_step=floating_signup_form';
      }
      let xhttp = new XMLHttpRequest();
      xhttp.open('GET', experimenterSignupFloatingUrl , true);
      xhttp.onload = function() {
        if (xhttp.status === 200 && JSON.parse(this.response).variant_url) {
          if(JSON.parse(this.response).variant_url == 'true') {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      }
      xhttp.timeout = 5000;
      xhttp.send(null);
    });
  }

  //calling to check whether to enable or disable floating form
  setFloatFormWorking();

  if (!getCookieValue('index')) {
    !function(variantUrl, request, scriptTag, timeTracker, start){
      timeTracker = new Date();
      start = timeTracker.getTime();
      request = new XMLHttpRequest();
      request.onerror = request.ontimeout = request.onload = function() {
        window.__loadTime__ = timeTracker.getTime() - start;
        try{
          window.__variantUrl__ = JSON.parse(this.response).variant_url;
          if (!window.__variantUrl__ || window.__variantUrl__ === 'undefined') {
            window.__variantUrl__ = "/r3/index.html";
          }
        } catch(err) {
          window.__variantUrl__ = "/r3/index.html";
        }
        variantUrl = window.__variantUrl__.replace(/\"/g,'');
        if (variantUrl.indexOf('.js') === -1){
          if (location.hostname === 'try.whydrivelyft.com' || location.hostname === 'www.whydrivelyft.com') {
            getRequestStatus().then(function(response) {
              if (response >= 400) {
                // handle redirect if navigated to a page that does not exist on WDL
                window.location.replace(variantUrl + queryParams);
                document.cookie = 'funnelStep=' + funnelStep + ";domain=.whydrivelyft.com;path=/";
              } else if (location.pathname === '/' || location.pathname === '/index.html') {
                // if navigating to the root of the site
                window.location.replace(variantUrl + queryParams);
                document.cookie = 'funnelStep=' + funnelStep + ";domain=.whydrivelyft.com;path=/";
              } else {
                // if navigating to an index page on initial visit that is not inside of the root
                if (location.pathname.indexOf('index') !== -1 && !getCookieValue('funnelStep')) {
                  for (var i = 0; i < anchorEls.length; i++) {
                    anchorEls[i].href = location.origin + location.pathname + queryParams;
                  }

                  document.cookie = "index=" + location.pathname + ";domain=.whydrivelyft.com;path=/";
                } else {
                  // if user lands on any page that is not an index
                  for (var i = 0; i < anchorEls.length; i++) {
                    anchorEls[i].href = variantUrl + queryParams;
                  }

                  document.cookie = 'funnelStep=' + funnelStep + ";domain=.whydrivelyft.com;path=/";
                }
              }
            });
          } else {
            return;
          }
        } else {
          scriptTag = document.createElement('script');
          scriptTag.type='text/javascript';
          scriptTag.src = variantUrl;
          document.head.appendChild(scriptTag);
        }
      };
      request.open('GET', experimenterUrl + userId, true);
      request.timeout = 5000;
      request.send(null);
    }();
  }

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

  function getRequestStatus() {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      var url = location.href;

      xhr.open('GET', url, true);

      xhr.onload = function() {
        resolve(this.status);
      };

      xhr.send(null);
    });
  }
});
