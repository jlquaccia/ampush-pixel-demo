import {jump} from '../js/vendor/jump';

/**
 * Handles smooth scroll functionality.
 */
export function smoothScroll() {
  let pageUrl = location.hash ? stripHash(location.href) : location.href;
  prepareJumpToLinks();

  /**
   * Gets anchor element and register a click event.
   */
  function prepareJumpToLinks() {
    let anchorEls;

    anchorEls = [].slice.call(document.querySelectorAll('a')).filter(isInPageLink);
      anchorEls.forEach(function(anchor) {
        anchor.addEventListener('click', handleScroll, false);
      });
  }

  /**
   * Handles smooth scrolling of page.
   */
  function handleScroll(e) {
    e.stopPropagation();
    e.preventDefault();
    jump(this.getAttribute('href'), {
      duration: 500
    });
  }

  /**
   * Manipulate anchor element.
   */
  function isInPageLink(n) {
    return n.tagName.toLowerCase() === 'a' && n.hash.length > 0 && stripHash(n.href) ===
      pageUrl;
  }

  /**
   * Strip hash value
   *
   * @param {string} url Page url.
   */
  function stripHash(url) {
    return url.slice(0, url.lastIndexOf('#'));
  }
}
