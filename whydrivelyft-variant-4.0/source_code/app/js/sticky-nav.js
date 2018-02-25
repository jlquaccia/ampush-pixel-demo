/**
 * Fix the navigation on page scroll.
 */

export function stickyNav() {
  window.onscroll = function() {
    let promoBanner = document.getElementsByClassName('promo-banner')[0];
    let navbar = document.getElementsByClassName('nav')[0];
    // If user scrolls back from bootom to top
    if (window.pageYOffset === 0.0) {
      promoBanner.classList.remove("hide-scroll");
      navbar.classList.remove("nav__fix-top");
    // If user scrolls from top to bottom
    } else {
      promoBanner.classList.add("hide-scroll");
      navbar.classList.add("nav__fix-top");
    }
  };
}
