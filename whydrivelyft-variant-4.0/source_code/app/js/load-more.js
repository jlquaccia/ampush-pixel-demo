/**
 * Handles zippy type functionality.
 */
import {jump} from '../js/vendor/jump';
export function loadMore() {
  let features = document.getElementsByClassName('js_features')[0];
  let showMoreBtn = document.getElementsByClassName('show-more')[0];
  let postHeight = document.getElementsByClassName("recent-posts")[0].offsetHeight;
  let post = document.getElementsByClassName("recent-posts");
  let postCount = document.getElementsByClassName("recent-posts").length;
  let previous = document.getElementsByClassName('blog-prev')[0];
  let next = document.getElementsByClassName('blog-next')[0];

  /**
   * Code for load more feature
   */
  let showCount = 0, fullHeight = 0, i;
  showMoreBtn.addEventListener('click', loadAll, false);
  window.addEventListener('load',function(){
    postHeight = document.getElementsByClassName("recent-posts")[0].offsetHeight;
    showMoreBtn.click();
  });
  /**
   * Updates page structure on window resize.
   */
  window.addEventListener('resize',function(){
    if (window.innerWidth < 768) {
      let currentActive = document.getElementsByClassName('active-post')[0];
      features.style.cssText = 'height:' + (currentActive.offsetHeight + 25) +
        'px;overflow:hidden;transition:height 1s;-moz-transition:height 1s;' +
            '-webkit-transition:height 1s;';
    }else{
      showCount--;
      showMoreBtn.click();
    }

  });

  function loadAll(e) {
    e.preventDefault();
    fullHeight = 0;
    showCount += 1;
    let activeDiv;
    if(showCount >= postCount) {
      showMoreBtn.style.display = 'none';
    }
    else{
      showMoreBtn.style.display = 'block';
    }
    for(i=0;i<showCount;i++) {
      fullHeight += (post[i].offsetHeight + 25);
      activeDiv= post[i];
    }

  // slides div to top
    if(activeDiv.previousSibling){
      if(activeDiv.previousSibling.hasAttribute('id')){
          activeDiv.previousSibling.removeAttribute("id");

      }
      activeDiv.setAttribute("id", "scroll-post")
      jump('#scroll-post', { duration: 300, offset: -70});
    }
    features.style.cssText = 'height:' + (fullHeight) +
      'px;overflow:hidden;transition:height 2s;-moz-transition:height 2s;' +
          '-webkit-transition:height 2s;';
  }

  /**
   * Code for previous-next feature
   */
   previous.addEventListener('click', loadPrevious, false);
   next.addEventListener('click', loadNext, false);

   function loadPrevious(e) {
     e.preventDefault();
     let currentActive = document.getElementsByClassName('active-post')[0];
     let previousActive = currentActive.previousSibling;
     if(previousActive != null){
       next.style.display = 'inline-block';
       currentActive.classList.remove('active-post');
       previousActive.classList.add('active-post');
       jump('#post-recent', { duration: 300 , offset: -70});
       features.style.cssText = 'height:' + (previousActive.offsetHeight + 25) +
         'px;overflow:hidden;transition:height 1s;-moz-transition:height 1s;' +
             '-webkit-transition:height 1s;';
       if(!currentActive.previousSibling.previousSibling) {
         previous.style.display = 'none';
       }
     }
   }

   function loadNext(e) {
     e.preventDefault();
     let currentActive = document.getElementsByClassName('active-post')[0];
     let nextActive = currentActive.nextSibling;
     if(nextActive != null){
       previous.style.display = 'inline-block';
       currentActive.classList.remove('active-post');
       nextActive.classList.add('active-post');
      jump('#post-recent', { duration: 300 , offset: -70});
      features.style.cssText = 'height:' + (nextActive.offsetHeight + 25) +
        'px;overflow:hidden;transition:height 1s;-moz-transition:height 1s;' +
            '-webkit-transition:height 1s;';
      if(!currentActive.nextSibling.nextSibling) {
        next.style.display = 'none';
      }
     }
   }
}
