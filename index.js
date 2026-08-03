import $, { param } from "jquery";
// const jQuery = require("./js/jquery-2.2.4.min.js");
// const $ = require("./lib/jquery/jquery.min.js");
// var jquery = require("jquery");
window.$ = window.jQuery = $;
// window.$ = window.jQuery = jquery; // notice the definition of global variables here

import jquerymigrate from "jquery-migrate";
// Suppress deprecated API warnings from owl.carousel (abandoned lib, harmless)
$.migrateMute = true;
// const jquerymigrate = require("/js/jquery-migrate.min.js");
// const bootstrap = require("./lib/bootstrap/js/bootstrap.min.js");
// const popper = require("/js/popper.min.js");
// const bootstrap = "js/bootstrap.min.js";
const WOW = require("./js/wow.min.js");
// import WOW from "wowjs";
// window.Wow = WOW;
import bootstrap from "bootstrap";
const superfish = require("/js/superfish.min.js");
const magnific = require("/js/jquery.magnific-popup.min.js");
const carousel = require("/js/owl.carousel.min.js");

//var natural = require('natural');
//window.natural = natural;

//import { findKeyword } from "./keyword.js";
import { getImage } from "./image.js";

// Mark the bundle as alive so the HTML fallback does not strip AOS styles.
window.__SITE_BOOTED__ = true;
document.documentElement.classList.remove("aos-fallback");

// Defer DOM-dependent init until the page has fully loaded (CSS, images).
// Firefox + Malwarebytes/ad blockers often delay the module past
// DOMContentLoaded — and sometimes past window "load". If readyState is
// already "complete", run immediately; otherwise wait for load.
function whenPageLoaded(fn) {
  if (document.readyState === "complete") {
    fn();
  } else {
    $(window).on("load", fn);
  }
}

function safe(label, fn) {
  try {
    fn();
  } catch (err) {
    console.warn("[site init]", label, err);
  }
}

whenPageLoaded(function () {
  safe("WOW", function () {
    new WOW().init();
  });

  safe("owlCarousel", function () {
    $(".owl-carousel").owlCarousel({
      items: 1,
      loop: true,
      autoplay: true,
      autoHeight: true,
      onInitialized: startProgressBar,
      onTranslate: resetProgressBar,
      onTranslated: startProgressBar,
    });
  });

  function startProgressBar() {
    $(".slide-progress").css({
      width: "100%",
      transition: "width 5000ms"
    });
  }

  function resetProgressBar() {
    $(".slide-progress").css({
      width: 0,
      transition: "width 0s"
    });
  }

  //window.findKeyword = findKeyword;
  window.getImage = getImage;

  safe("Typed", function () {
    const TypedMod = require("/js/typed.min.js");
    const Typed = TypedMod && TypedMod.default ? TypedMod.default : TypedMod;
    const target = document.getElementById("typed");
    if (!target || typeof Typed !== "function") {
      throw new Error("Typed constructor unavailable");
    }
    new Typed("#typed", {
      stringsElement: "#typed-strings",
      backSpeed: 40,
      typeSpeed: 40,
      loop: true
    });
    target.setAttribute("data-typed-active", "1");
    window.__TYPED_READY__ = true;
  });

  safe("lightcase", function () {
    require("/js/lightcase.js");
  });

  safe("AOS", function () {
    const AOS = require("./js/aos.js");
    AOS.init({
      offset: 200,
      duration: 600,
      easing: "ease-in-sine",
      delay: 100,
      disable: "mobile"
    });
  });

  // Waypoint must load before custom.js (custom constructs Waypoint instances)
  safe("waypoint+custom", function () {
    require("/js/waypoint.min.js");
    require("/js/custom.js");
  });
});

function sendEmail(){
  var form = $("myform");
  async function handleSubmit(event) {
  event.preventDefault();
  var status = $("formStatus");
  var data = new FormData(event.target);
  fetch(event.target.action, {
    method: form.method,
    body: data,
    headers: {
      'Accept': 'application/json'
  }
  }).then(response => {
    if (response.ok) {
      status.innerHTML = "Thanks for your submission!";
      form.reset()
    } else {
      response.json().then(data => {
      if (Object.hasOwn(data, 'errors')) {
        status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
      } else {
        status.innerHTML = "Oops! There was a problem submitting your form"
      }
    })
  }
  }).catch(error => {
    status.innerHTML = "Oops! There was a problem submitting your form"
  });
  }
  form.addEventListener("submit", handleSubmit)
}
// function sendEmail() {
//   console.log("hitting the send button");
//   if (!$("#msgInput").val()) {//robot test
//     var params = {
//       from_name: $("#msgName").val(),
//       subject: $("#msgSubject").val(),
//       message: $("#msgMessage").val(),
//       reply_to: $("#msgEmail").val(),
//     };

//     console.log('built params')
//     var data = {
//       service_id: 'service_er9utfj',
//       template_id: 'template_ij3x988',
//       user_id: '05PTXCIpnsxT2QWk3',
//       template_params: params
//     };
//     console.log('built data')

//     $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
//       type: 'POST',
//       data: JSON.stringify(data),
//       contentType: 'application/json'})
//     .done(function() {
//         console.log('sent')
//         $('#alertBody').val('Yip, he\'s got your email now.')
//         $('#exampleModalCenter').modal()
//     }).fail(function(error) {
//         console.log('failed ',JSON.stringify(error))
//         $('#alertBody').val('Oops... Something went wrong, please try again') 
//     });
  
//     console.log('ajax sent')
//   }
  
// }

window.sendEmail = sendEmail;
