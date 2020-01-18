import $ from 'jquery';
// const jQuery = require("./js/jquery-2.2.4.min.js");
// const $ = require("./lib/jquery/jquery.min.js");
window.$ = window.jQuery = $
const jquerymigrate = require("/js/jquery-migrate.min.js");
// const bootstrap = require("./lib/bootstrap/js/bootstrap.min.js");
const popper = require("/js/popper.min.js");
// const bootstrap = "js/bootstrap.min.js";
import bootstrap from "bootstrap";
const superfish = require("/js/superfish.min.js");
const magnific = require("/js/jquery.magnific-popup.min.js");
const carousel = require("/js/owl.carousel.min.js");
// const isotope = require("./js/isotope.pkgd.min.js");
// const WOW = require("/js/wow.min.js");
import WOW from 'wowjs';
window._wowjs = WOW
new WOW().init();
const typed = require("/js/typed.min.js");
const lightcase = require("/js/lightcase.js");
const aos = require("/js/aos.js");
const waypoint = require("/js/waypoint.min.js");
const custom = require("/js/custom.js"); 