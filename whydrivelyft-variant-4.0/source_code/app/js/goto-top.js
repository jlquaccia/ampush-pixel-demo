
/**
 * Scroller classes.
 */
const ScrollerClasses = {
    SCROLL_ICON: 'goto-top',
    HIDE: 'hide-goto'
  };

let scrollToTop = document.getElementsByClassName(ScrollerClasses.SCROLL_ICON)[0];
/**
 * Handles Form scroll functionality.
 */
export function scroller() {

  document.onscroll = scrollFunction;

  function scrollFunction() {
    if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
        scrollToTop.classList.remove(ScrollerClasses.HIDE);
    } else {
        scrollToTop.classList.add(ScrollerClasses.HIDE);
    }
  }
}
