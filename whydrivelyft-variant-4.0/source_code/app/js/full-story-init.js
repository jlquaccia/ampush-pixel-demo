/**
 * Detemine whether to load the full story pixel or not based on experimenter
 *
 */

export let fullStoryInit = () => {
  var experimenterUrl;
  if (/www.whydrivelyft.com/.test(window.location.href)){
    experimenterUrl= 'https://experimenter.ampush.io/experimenter?partner_id=lyft&initiative=ce4c0c2b8-3c40-4963-9164-198a13f7689e&funnel_step=fullstory_integration';
  } else {
    experimenterUrl= 'https://experimenterqa.ampush.io/experimenter?partner_id=lyft&initiative=ce4c0c2b8-3c40-4963-9164-198a13f7689e&funnel_step=fullstory_integration';
  }

  let xhttp = new XMLHttpRequest();

  xhttp.open('GET', experimenterUrl , true);

  xhttp.onload = () => {
    let twoSecondTimeout = false;
    let data = JSON.parse(xhttp.response);

    setTimeout(() => {
      twoSecondTimeout = true;
    }, 2000);

    if (localStorage.getItem('fs') == null) {
      if (twoSecondTimeout) {
        // timed out, experimenter took longer than 2 seconds, don't do anything
        return;
      } else {
        if (data.variant_url.toLowerCase() === 'true') {
          localStorage.setItem('fs', 'true');
          enableFullStory();
        } else {
          localStorage.setItem('fs', 'false');
        }
      }
    } else if (localStorage.getItem('fs') == 'true') {
      enableFullStory();
    } else {
      // fs was set to false in localstorage, don't do anything
      return;
    }
  };

  xhttp.send();
};

function enableFullStory() {
  // full story pixel
  window['_fs_debug'] = false;
  window['_fs_host'] = 'fullstory.com';
  window['_fs_org'] = '7DGKW';
  window['_fs_namespace'] = 'FS';
  (function(m,n,e,t,l,o,g,y){
    if (e in m) {if(m.console && m.console.log) { m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');} return;}
    g=m[e]=function(a,b){g.q?g.q.push([a,b]):g._api(a,b);};g.q=[];
    o=n.createElement(t);o.async=1;o.src='https://'+_fs_host+'/s/fs.js';
    y=n.getElementsByTagName(t)[0];y.parentNode.insertBefore(o,y);
    g.identify=function(i,v){g(l,{uid:i});if(v)g(l,v)};g.setUserVars=function(v){g(l,v)};
    g.identifyAccount=function(i,v){o='account';v=v||{};v.acctId=i;g(o,v)};
    g.clearUserCookie=function(c,d,i){if(!c || document.cookie.match('fs_uid=[`;`]*`[`;`]*`[`;`]*`')){
    d=n.domain;while(1){n.cookie='fs_uid=;domain='+d+
    ';path=/;expires='+new Date(0).toUTCString();i=d.indexOf('.');if(i<0)break;d=d.slice(i+1)}}};
  })(window,document,window['_fs_namespace'],'script','user');
  // end full story pixel
}
