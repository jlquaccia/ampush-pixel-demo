/**
 * Activet navigation tab based on body class.
 */

 export function activeNav() {
   let bodyClass  = document.getElementsByTagName('body')[0].getAttribute('nav-menu');
   let navEl = document.getElementsByClassName('nav__tabs')[0];

   //Check if page has navigation
   if (navEl) {
     if(bodyClass){
       let navAttr = navEl.getElementsByTagName('a');

       for (let i = 0; i < navAttr.length; i++ ) {
          let navAttrClass = navAttr[i].getAttribute('data-track1');
          if (navAttrClass == bodyClass) {
            navAttr[i].className += ' active';
          }
       }
     }
   }
 }
