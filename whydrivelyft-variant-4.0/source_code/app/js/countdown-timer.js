/**
 * Handles countdown timer functionality for the index page
 */
export function countDownTimer() {
  // Set the date we're counting down to
  var countDownDate = new Date("Dec 26, 2017 00:00:00").getTime();

  //Hide extra bonus text
  var bonus_a = document.getElementById("bonus-a");

  if (bonus_a) {
    bonus_a.style.display = "none";
  }

  //set timer first time
  timer();
  // Update the count down every 1 second
  var x = setInterval(timer, 1000);

  function timer() {
    // Get todays date and time
    var now = new Date().getTime();

    // Find the distance between now an the count down date
    var distance = countDownDate - now;
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // If the count down is over, write some text
    if (distance < 0) {
      if (x) {
        clearInterval(x);
      }
      document.getElementById("timerbox").innerHTML = "OFFER EXPIRED";
      return;
    }

    // Output the result in an element with id="timerbox"
    document.getElementById("count-days").innerHTML = days;
    document.getElementById("count-hours").innerHTML = hours;
    document.getElementById("count-minutes").innerHTML = minutes;
    document.getElementById("count-seconds").innerHTML = seconds;
  }

  /*Extra code to make fixed cta vidible on scroll*/
  window.onscroll = scrollFunctionTimer;
  function scrollFunctionTimer() {
    let offset = document.getElementsByClassName("full-hero")[0].scrollHeight - 50;
    let ctaBottom = document.getElementsByClassName("js-cta")[0];
    if (document.body.scrollTop > offset || document.documentElement.scrollTop > offset) {
      ctaBottom.classList.remove("show-on-mobile-port-home");
    } else {
      ctaBottom.classList.add("show-on-mobile-port-home");
    }
  }
};
