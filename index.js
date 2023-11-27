import $, { param } from "jquery";
// const jQuery = require("./js/jquery-2.2.4.min.js");
// const $ = require("./lib/jquery/jquery.min.js");
// var jquery = require("jquery");
window.$ = window.jQuery = $;
// window.$ = window.jQuery = jquery; // notice the definition of global variables here

import jquerymigrate from "jquery-migrate";
// const jquerymigrate = require("/js/jquery-migrate.min.js");
// const bootstrap = require("./lib/bootstrap/js/bootstrap.min.js");
// const popper = require("/js/popper.min.js");
// const bootstrap = "js/bootstrap.min.js";
const WOW = require("./js/wow.min.js");
// import WOW from "wowjs";
// window.Wow = WOW;
new WOW().init();
import bootstrap from "bootstrap";
const superfish = require("/js/superfish.min.js");
const magnific = require("/js/jquery.magnific-popup.min.js");
const carousel = require("/js/owl.carousel.min.js");

//var natural = require('natural');
//window.natural = natural;

//import { findKeyword } from "./keyword.js";
import { getImage } from "./image.js";

//Init the carousel
initSlider();

function initSlider() {
  $(".owl-carousel").owlCarousel({
    items: 1,
    loop: true,
    autoplay: true,
    onInitialized: startProgressBar,
    onTranslate: resetProgressBar,
    onTranslated: startProgressBar,
  });
}

function startProgressBar() {
  // apply keyframe animation
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

// const isotope = require("./js/isotope.pkgd.min.js");
const Typed = require("/js/typed.min.js");
var typed = new Typed("#typed", {
  stringsElement: "#typed-strings",
  backSpeed: 40,
  typeSpeed: 40,
  loop: true
});
const lightcase = require("/js/lightcase.js");
const AOS = require("./js/aos.js");
new AOS.init({
  offset: 200,
  duration: 600,
  easing: "ease-in-sine",
  delay: 100,
  disable: "mobile"
});
const custom = require("/js/custom.js");

const waypoint = require("/js/waypoint.min.js");


function sendEmail() {
  console.log("hitting the send button");
  if (!$("#msgInput").val()) {//robot test
    var params = {
      from_name: $("#msgName").val(),
      subject: $("#msgSubject").val(),
      message: $("#msgMessage").val(),
      reply_to: $("#msgEmail").val(),
    };

    console.log('built params')
    var data = {
      service_id: 'service_er9utfj',
      template_id: 'template_ij3x988',
      user_id: '05PTXCIpnsxT2QWk3',
      template_params: params
    };
    console.log('built data')

    $.ajax('https://api.emailjs.com/api/v1.0/email/send', {
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json'})
    .done(function() {
        console.log('sent')
        $('#alertBody').val('Yip, he\'s got your email now.')
        $('#exampleModalCenter').modal()
    }).fail(function(error) {
        console.log('failed ',JSON.stringify(error))
        $('#alertBody').val('Oops... Something went wrong, please try again') 
    });
  
    console.log('ajax sent')
  }
  
}

window.sendEmail = sendEmail;
