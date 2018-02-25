import {jump} from '../js/vendor/jump';

var ctas = document.getElementsByClassName("driver-cta");
var ctaFixed = ctas[ctas.length-1];
var ctaHidden =  document.getElementsByClassName("driver-cta-hidden")[0];
var scrollToTopElements = document.getElementsByClassName("jump");
var offsetVal = -70;

export function accelerate() {

  window.addEventListener('scroll', animateCTA);
  window.addEventListener('resize', animateCTA);
  for(var i= 0 ; i<scrollToTopElements.length; i++) {
    scrollToTopElements[i].addEventListener('click',setPositionToTop);
  }

  function animateCTA() {
    //since this js file is called in how-it-works and other pages so need to check whether it is present on the page or not
    //ctaHidden class/functionality is only on accelerate page
    if(ctaHidden) {
      if(window.innerWidth < 480) {
        if(isInViewport(ctaHidden)) {
          ctaFixed.classList.add("hide");
        } else {
          ctaFixed.classList.remove("hide");
        }
      } else {
        ctaFixed.classList.remove("hide");
      }
    }
  }

  function setPositionToTop(e) {
    e.preventDefault();
    var whereToScroll = e.target.parentElement.getAttribute("data-jump_to");3
    /*Below mentioned offsetVal is navbar height at different size of screen*/
    if(window.innerWidth < 480)
      offsetVal = -70;
    else if(window.innerWidth < 768)
      offsetVal = -73;
    else if(window.innerWidth < 900)
      offsetVal = -76;
    else
      offsetVal = -48;

    jump("#"+whereToScroll, { duration: 500 , offset: offsetVal});
  }

  var isInViewport = function (elem) {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };
}
