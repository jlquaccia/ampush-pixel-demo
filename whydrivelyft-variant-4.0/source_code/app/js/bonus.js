/**
 * Handles Bonus functionality.
 */
export function bonus() {
    let params = parseQueryString();
    let queryString = location.search.substr(1);
    let bonus;let days; let rides; let temp;

    bonus = "$500";
    days  = 45;
    rides = 150;
    temp = "driver-promotion-b.html?" + queryString;

    if(queryString.indexOf("7fh285_auid") != -1) {
      queryString = queryString.substr(0,queryString.indexOf("7fh285_auid")-1); /*removing 7fh285_auid*/
    }

    if(document.getElementById("bonus") && document.getElementById("bonus-a") && document.getElementById("days") ){ /* only applicable to testimonial pages */
      if (params.hasOwnProperty("code")) {
          bonus = params.code;
        switch(bonus) {
          case "AMP350FB":
          case "AMP350G":
              bonus = "$350";
              days  = 45;
              rides = 150;
              temp = "driver-promotion-b.html?" + queryString;
              break;
          case "AMP200FB":
          case "AMP200G":
              bonus = "$200";
              days  = 30;
              rides = 50;
              temp = "driver-promotion-a.html?" + queryString;
              break;
          default:
              bonus = "$500";
              days  = 45;
              rides = 150;
              temp = "driver-promotion-b.html?" + queryString;
        }
      }
        document.getElementById("bonus").innerHTML = bonus;
        document.getElementById("bonus-a").innerHTML = bonus;
        document.getElementById("rides").innerHTML = rides;
        document.getElementById("days").innerHTML = days;
        let anchor = document.getElementById("seeTerms");
        anchor.href = anchor + temp;
    }
}

let parseQueryString = function() {
    let str = window.location.search || '';
    let objURL = {};
    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL;
};
