import { lory } from '../js/vendor/lory.js';
/**
 * Handles carousal functionality.
 */
var screenWidth = 768;
var slider;
export function carousal() {
    document.addEventListener('DOMContentLoaded', function () {
        setLoryMode(false);
    });
    setTimeout(carousalFix, 500);

    function setLoryMode(isWindowResized) {
        var multiSlides = document.querySelector('.js_multislides');
        if(isWindowResized)
            slider.destroy();
        if (window.innerWidth >= screenWidth) { /*For Desktop & Tablet */
          if (document.getElementById('blog-carousal-story')) {
            slider = lory(multiSlides, {
                infinite: 2,
                slidesToScroll: 1,
            });
          }else{
            slider = lory(multiSlides, {
                infinite: 3,
                slidesToScroll: 3,
            });
          }
        }else { /*For Mobile */
            slider = lory(multiSlides, {
                infinite: 1,
                slidesToScroll: 1,
            });
        }
    }
    window.addEventListener("resize", function () {
        setLoryMode(true);
    });
    /* extra js for safari/ios carousel li top alignment fix*/
    function carousalFix() {
        var slideItemNew = document.getElementsByClassName("js_slide");
        for(var i=0;i < slideItemNew.length;i++) {
            slideItemNew[i].style.top = 0 - slideItemNew[i].offsetTop + "px";
        }
    }
};
