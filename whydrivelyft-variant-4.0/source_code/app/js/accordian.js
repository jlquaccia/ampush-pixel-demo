import {jump} from '../js/vendor/jump';
/**
 * Accordian classes to manipulate elements.
 * @private @enum {string}
 */
const AccordianClasses = {
    ACCORDIAN_CONTAINER: 'question-container',
    ACCORDIAN_QUESTION: 'questions__quest',
    ACCORDIAN_ANSWER_OPEN: 'questions__ans--open',
    ACCORDIAN_CONTAINER_OPEN: 'questions__question--open',
    ACCORDIAN_ANSWER: 'questions__ans'
  };

  /**
   * Handles accordian functionality.
   */
  export function questionsAccordian() {
    let accEl = document.getElementsByClassName(AccordianClasses.ACCORDIAN_QUESTION);
    let panel = document.getElementsByClassName(AccordianClasses.ACCORDIAN_ANSWER_OPEN)[0];
    let allPanel = document.getElementsByClassName(AccordianClasses.ACCORDIAN_ANSWER);
    let isFirstAccordionClick = true;

    for (let i = 0;i < accEl.length; i++) {
      accEl[i].addEventListener('click', toggle, false);
    }
    window.addEventListener("resize",updateHeightOfAllPanel);

    updateHeightOfAllPanel();
    //panel.style.maxHeight = panel.scrollHeight + 'px'; //needs to be after fisrt call of updateHeightOfAllPanel()

    /**
     * change max-height of inner content(ACCORDIAN_ANSWER) on basis of screen size(mobile/other)
     */
    function updateHeightOfAllPanel() {

        if(window.innerWidth > 480) {
            for(let i = 0; i < allPanel.length; i++)
                allPanel[i].style.maxHeight = allPanel[i].scrollHeight + 'px';
        }else {
            for(let i = 0; i < allPanel.length; i++) {
                if(!(allPanel[i].classList.contains(AccordianClasses.ACCORDIAN_ANSWER_OPEN)))
                    allPanel[i].style.maxHeight = 0;
                  else
                    allPanel[i].style.maxHeight = allPanel[i].scrollHeight + 'px';
            }
        }
    }
    /**
     * Toogle accordian elements;
     */
    function toggle(e) {

        // This condition is to stop functioning of accordian in views other than phone.
      if(window.innerWidth > 480)
        return;
      let openEl = document.getElementsByClassName(AccordianClasses.ACCORDIAN_CONTAINER_OPEN)[0];
      let openAnsEl = document.getElementsByClassName(AccordianClasses.ACCORDIAN_ANSWER_OPEN)[0];
      let panel = null;
      let parentEl = null;
      let isAlreadyOpen = false;
      let prev=0,curr=0;

      // This condition is only evaluated first time when all of the accordian items are closed
      // Setting openContainer and openAnswer to clicked element
      if(!openEl && !openAnsEl) {
          isFirstAccordionClick = true;//ie all accordion items closed
          if(e.target.classList.contains(AccordianClasses.ACCORDIAN_QUESTION)) {
            openEl = e.target.parentElement;
            openAnsEl = e.target.nextSibling;
          }
          else if(e.target.classList.contains(AccordianClasses.ACCORDIAN_CONTAINER)) {
            openEl = e.target;
            openAnsEl = e.target.childNodes[1];
          }
          openEl.classList.add(AccordianClasses.ACCORDIAN_CONTAINER_OPEN);
          openAnsEl.classList.add(AccordianClasses.ACCORDIAN_ANSWER_OPEN);
          openAnsEl.style.maxHeight = openAnsEl.scrollHeight + 'px';
      }

      // This condition is require to check whether open element is click.
      if (e.target.classList.contains(AccordianClasses.ACCORDIAN_CONTAINER_OPEN) ||
      e.target.parentElement.classList.contains(AccordianClasses.ACCORDIAN_CONTAINER_OPEN)) {
        isAlreadyOpen = true;
      }
      //finding previous opened and currently clicked element
      for(let i=0;i<allPanel.length;i++) {
        if(allPanel[i] == openAnsEl)
          prev = i;
        if(allPanel[i] == e.target.nextSibling)
          curr = i;
      }
      if(curr == undefined)
        curr = prev;
      if(prev < curr){
        if(prev == 0 && curr != 1) {
          setPositionToTop(e,openAnsEl.style.maxHeight.replace("px","")-40);
        }
        else {
          setPositionToTop(e,openAnsEl.style.maxHeight.replace("px","")); // if prev opened element is before than current element than offset of that opened element is required by jumnp()
        }
      }
      else {
        setPositionToTop(e,"0"); // if prev opened elt is after current clicked then no offset is required while calling jump() methos
      }

      if (!isAlreadyOpen) {
        // Check whether event triggers due to child element and accordingly update the
        // values.
        if (e.target.classList.contains(AccordianClasses.ACCORDIAN_QUESTION)) {
          panel = e.target.nextElementSibling;
          parentEl = e.target.parentElement;
        } else {
          panel = e.target.childNodes[1];
          parentEl = e.target;
        }
        openEl.classList.remove(AccordianClasses.ACCORDIAN_CONTAINER_OPEN);
        openAnsEl.classList.remove(AccordianClasses.ACCORDIAN_ANSWER_OPEN);
        parentEl.classList.add(AccordianClasses.ACCORDIAN_CONTAINER_OPEN);
        panel.style.maxHeight = panel.scrollHeight + 'px';
        openAnsEl.style.maxHeight = 0;
        panel.classList.add(AccordianClasses.ACCORDIAN_ANSWER_OPEN);
      } else {
          if(openAnsEl) {
            if(!isFirstAccordionClick){
              openEl.classList.remove(AccordianClasses.ACCORDIAN_CONTAINER_OPEN);
              openAnsEl.classList.remove(AccordianClasses.ACCORDIAN_ANSWER_OPEN);
              openAnsEl.style.maxHeight = 0;
            }else {
              isFirstAccordionClick = false;
            }
        }
      }

    }
     function setPositionToTop(e,offsetOfOpenedElement) {
       offsetOfOpenedElement = parseFloat(offsetOfOpenedElement) + 60; // +60 is offset for fixed header
       let whereToScroll = e.target.parentElement.parentElement.id;
       if(offsetOfOpenedElement == "0")
          jump("#"+whereToScroll, { duration: 300 , offset: offsetOfOpenedElement});
        else
          jump("#"+whereToScroll, { duration: 300 , offset: -offsetOfOpenedElement});
     }
  }
