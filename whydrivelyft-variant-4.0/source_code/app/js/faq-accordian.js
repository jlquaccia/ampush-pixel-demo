/**
 * Accordian classes to manipulate elements.
 * @private @enum {string}
 */
const AccordianClasses = {
  ACCORDIAN_ITEM: 'accordionItem',
  ACCORDIAN_HEADING: 'accordionItemHeading',
};

  /**
   * Handles accordian functionality.
   */
export function faqAccordian() {

  let accItem = document.getElementsByClassName(AccordianClasses.ACCORDIAN_ITEM);
  let accHD = document.getElementsByClassName(AccordianClasses.ACCORDIAN_HEADING);
  for (let i = 0; i < accHD.length; i++) {
    accHD[i].addEventListener('click', toggleItem, false);
  }

  function toggleItem() {
    let itemClass = this.parentNode.className;
    for (let i = 0; i < accItem.length; i++) {
      accItem[i].className = 'accordionItem close';
    }
    if (itemClass == 'accordionItem close') {
      this.parentNode.className = 'accordionItem open';
    }
  }
}
