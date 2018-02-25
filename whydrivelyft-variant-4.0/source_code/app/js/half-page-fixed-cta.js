
/**
 * Scroller classes.
 */
const HalfPageFixedCta = {
  FIXED_CTA: 'fixed-mobile-cta',
  HIDE_CTA: 'hide-on-mobile-port'
};

let half_page_cta = document.getElementsByClassName(HalfPageFixedCta.FIXED_CTA)[0];
let half_page_height = document.getElementsByTagName('body')[0].clientHeight / 2;

/**
 * Handles Form scroll functionality.
 */
export function halfPageCta() {

  document.addEventListener('scroll',showHideCta);
  showHideCta();

  function showHideCta() {
    if(document.body.scrollTop > half_page_height || document.documentElement.scrollTop > half_page_height)
      half_page_cta.classList.remove(HalfPageFixedCta.HIDE_CTA);
    else
      half_page_cta.classList.add(HalfPageFixedCta.HIDE_CTA);
  }
}
