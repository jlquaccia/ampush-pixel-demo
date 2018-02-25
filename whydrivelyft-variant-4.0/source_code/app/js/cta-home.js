export function ctaHome() {
  window.addEventListener('scroll', onScroll);
  function onScroll() {
    // Determine if an element is in the visible viewport
    var rect = document.getElementById('home-cta').getBoundingClientRect();
    var html = document.documentElement;
    if (rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || html.clientHeight) && rect.right <= (window.innerWidth || html.clientWidth)) {
      document.getElementsByClassName('js-cta')[0].classList.add("show-on-mobile-port-home");
    }
    else {
      document.getElementsByClassName('js-cta')[0].classList.remove("show-on-mobile-port-home");
    }
  };
}
