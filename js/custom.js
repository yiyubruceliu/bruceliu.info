$(document).ready(function() {
  "use strict";

  var window_width = $(window).width(),
    window_height = window.innerHeight,
    header_height = $(".default-header").height(),
    header_height_static = $(".site-header.static").outerHeight(),
    fitscreen = window_height - header_height;

  $(".fullscreen").css("height", window_height);
  $(".fitscreen").css("height", fitscreen);

  //------- Wow JS Initialized --------//
  // new WOW().init();

  //------- AOS JS Initialized --------//
  //   AOS.init({
  //     offset: 200,
  //     duration: 600,
  //     easing: "ease-in-sine",
  //     delay: 100,
  //     disable: "mobile"
  //   });

  //------- Go to Top --------//
  $(window).on("scroll", function() {
    if ($(this).scrollTop() > 100) {
      $("#header1").addClass("header-scrolled1");
      $("#back-top").addClass("back-top-animation");
    } else {
      $("#header1").removeClass("header-scrolled1");
      $("#back-top").removeClass("back-top-animation");
    }
  });

  //------- Typed --------//
  //   var typed = new Typed("#typed", {
  //     stringsElement: "#typed-strings",
  //     backSpeed: 40,
  //     typeSpeed: 40,
  //     loop: true
  //   });

  var waypoint = new Waypoint({
    element: document.getElementById("skill-area"),
    handler: function() {
      $(".progress").each(function() {
        console.log($(this).attr("data-percent")),
          $(this)
            .find(".progress-bar")
            .delay(1e4)
            .css({
              width: $(this).attr("data-percent")
            });
      });
    },
    offset: "80%"
  });

  /* ---------------------------------------------
        scroll body to 0px on click
     --------------------------------------------- */
  $("#back-top a").on("click", function() {
    $("body,html").animate(
      {
        scrollTop: 0
      },
      1000
    );
    return false;
  });

  //------- Filter  js --------//
  $(window).on("load", function() {
    $(".filters ul li").on("click", function() {
      $(".filters ul li").removeClass("active");
      $(this).addClass("active");

      var data = $(this).attr("data-filter");
      $grid.isotope({
        filter: data
      });
    });

    if (document.getElementById("work-area")) {
      var $grid = $(".grid").isotope({
        itemSelector: ".all",
        percentPosition: true,
        masonry: {
          columnWidth: ".all"
        }
      });
    }
  });

  //------- Superfist nav menu  js --------//

  $(".nav-menu").superfish({
    animation: {
      opacity: "show"
    },
    speed: 400
  });

  //------- Mobile Nav  js --------//

  if ($("#nav-menu-container").length) {
    var $mobile_nav = $("#nav-menu-container")
      .clone()
      .prop({
        id: "mobile-nav"
      });
    $mobile_nav.find("> ul").attr({
      class: "",
      id: ""
    });
    $("body").append($mobile_nav);
    $("body").prepend(
      '<button type="button" id="mobile-nav-toggle"><i class="lnr lnr-menu"></i></button>'
    );
    $("body").append('<div id="mobile-body-overly"></div>');
    $("#mobile-nav")
      .find(".menu-has-children")
      .prepend('<i class="lnr lnr-chevron-down"></i>');

    $(document).on("click", ".menu-has-children i", function(e) {
      $(this)
        .next()
        .toggleClass("menu-item-active");
      $(this)
        .nextAll("ul")
        .eq(0)
        .slideToggle();
      $(this).toggleClass("lnr-chevron-up lnr-chevron-down");
    });

    $(document).on("click", "#mobile-nav-toggle", function(e) {
      $("body").toggleClass("mobile-nav-active");
      $("#mobile-nav-toggle i").toggleClass("fa-cross fa-menu");
      $("#mobile-body-overly").toggle();
    });

    $(document).click(function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($("body").hasClass("mobile-nav-active")) {
          $("body").removeClass("mobile-nav-active");
          $("#mobile-nav-toggle i").toggleClass("fa-cross fa-menu");
          $("#mobile-body-overly").fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  //------- Lightbox  js --------//
  jQuery(document).ready(function($) {
    $("a[data-rel^=lightcase]").lightcase();
  });

  //------- Header Scroll Class  js --------//

  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $("#header").addClass("header-scrolled");
    } else {
      $("#header").removeClass("header-scrolled");
    }
  });

  //------- Owl Carusel  js --------//
  if ($(".active-brand-carusel").length) {
    $(".active-brand-carusel").owlCarousel({
      items: 5,
      loop: true,
      autoplayHoverPause: true,
      autoplay: true,
      responsive: {
        0: {
          items: 1
        },
        768: {
          items: 3
        },
        991: {
          items: 4
        },
        1024: {
          items: 5
        }
      }
    });
  }

  if ($(".testi_slider").length) {
    $(".testi_slider").owlCarousel({
      loop: true,
      margin: 30,
      items: 1,
      nav: true,
      autoplay: 2500,
      smartSpeed: 1500,
      dots: true,
      responsiveClass: true,
      navText: [
        "<i class='fas fa-arrow-left'></i>",
        "<i class='fas fa-arrow-right'></i>"
      ]
    });
  }
});


async function sendEmail(name,subject, email, message) {
const payload = {
    "name": name,
    "subject": `bruceliu.info: ${subject}`, 
    "email": email,
    "message": message,
    "password": "alshsniho092ujei489h"
  } ;
  const response = await fetch('https://bruceliu-info-email-service.herokuapp.com/sendEmail', {
    method: 'post',
    body: JSON.stringify(payload),
    headers: {'Content-Type': 'application/json'}
  });
  const data = await response.json();
  console.log(data);
}

$("#btnSendMail").on("click", function (){
  var name = $("#msgName").val();
  var subject = $("#msgSubject").val();
  var email = $("#msgEmail").val();
  var message = $("#msgMessage").val();

  
  
  sendEmail(name,subject, email, message);
  
});