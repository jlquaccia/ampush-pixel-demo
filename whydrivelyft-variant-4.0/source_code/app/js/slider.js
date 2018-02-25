/**
 * Handles slider functionality.
 */
export function Slider() {
  let slideIndex = 1;
  let prevEl = document.getElementsByClassName('block__slider-prev')[0];
  let nextEl = document.getElementsByClassName('block__slider-next')[0];
  let sliderEl = document.getElementsByClassName('slider-wrapper');

  prevEl.addEventListener('click', function() {
    slideElement(-1);
  }, false);
  nextEl.addEventListener('click', function() {
    slideElement(1);
  }, false);

  showDivs(slideIndex);

  /**
   * Slide the element depend upon the index pass.
   *
   * @param {number} dir direction of the slide.
   */
  function slideElement(dir) {
    showDivs(slideIndex += dir);
  }

  /**
   * Displays element.
   *
   * @param {number} count No. of clicks.
   */
  function showDivs(count) {
    if (count > sliderEl.length)
      slideIndex = 1
    if (count < 1)
      slideIndex = sliderEl.length
    for (let i = 0; i < sliderEl.length; i++) {
       sliderEl[i].style.display = 'none';
    }
    sliderEl[slideIndex-1].style.display = 'block';

    let targetDiv = document.getElementsByClassName('slider-wrapper')[slideIndex-1].getElementsByTagName('img')[0];

    if (targetDiv.getAttribute('src').indexOf('data') >= 0) {
        let targetImgSrc = targetDiv.getAttribute('data-src');

        targetDiv.setAttribute('src', targetImgSrc);
        targetDiv.removeAttribute('data-src');
    }
  }
}
