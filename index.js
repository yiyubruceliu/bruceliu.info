import $ from "jquery";
// const jQuery = require("./js/jquery-2.2.4.min.js");
// const $ = require("./lib/jquery/jquery.min.js");
window.$ = window.jQuery = $;
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
const waypoint = require("/js/waypoint.min.js");
const custom = require("/js/custom.js");
