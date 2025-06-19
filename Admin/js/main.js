/**
    * selectImages
    * menuleft
    * tabs
    * progresslevel
    * collapse_menu
    * fullcheckbox
    * showpass
    * gallery
    * coppy
    * select_colors_theme
    * icon_function
    * box_search
    * preloader
*/

; (function (Rs.) {

  "use strict";

  var selectImages = function () {
    if (Rs.(".image-select").length > 0) {
      const selectIMG = Rs.(".image-select");
      selectIMG.find("option").each((idx, elem) => {
        const selectOption = Rs.(elem);
        const imgURL = selectOption.attr("data-thumbnail");
        if (imgURL) {
          selectOption.attr(
            "data-content",
            "<img src='%i'/> %s"
              .replace(/%i/, imgURL)
              .replace(/%s/, selectOption.text())
          );
        }
      });
      selectIMG.selectpicker();
    }
  };

  var menuleft = function () {
    if (Rs.('div').hasClass('section-menu-left')) {
      var bt =Rs.(".section-menu-left").find(".has-children");
      bt.on("click", function () {
        var args = { duration: 200 };
        if (Rs.(this).hasClass("active")) {
          Rs.(this).children(".sub-menu").slideUp(args);
          Rs.(this).removeClass("active");
        } else {
          Rs.(".sub-menu").slideUp(args);
          Rs.(this).children(".sub-menu").slideDown(args);
          Rs.(".menu-item.has-children").removeClass("active");
          Rs.(this).addClass("active");
        }
      });
      Rs.('.sub-menu-item').on('click', function(event){
        event.stopPropagation();
      });
    }
  };

  var tabs = function(){
    Rs.('.widget-tabs').each(function(){
        Rs.(this).find('.widget-content-tab').children().hide();
        Rs.(this).find('.widget-content-tab').children(".active").show();
        Rs.(this).find('.widget-menu-tab').find('li').on('click',function(){
            var liActive = Rs.(this).index();
            var contentActive=Rs.(this).siblings().removeClass('active').parents('.widget-tabs').find('.widget-content-tab').children().eq(liActive);
            contentActive.addClass('active').fadeIn("slow");
            contentActive.siblings().removeClass('active');
            Rs.(this).addClass('active').parents('.widget-tabs').find('.widget-content-tab').children().eq(liActive).siblings().hide();
        });
    });
  };

  Rs.('ul.dropdown-menu.has-content').on('click', function(event){
    event.stopPropagation();
  });
  Rs.('.button-close-dropdown').on('click', function(){
    Rs.(this).closest('.dropdown').find('.dropdown-toggle').removeClass('show');
    Rs.(this).closest('.dropdown').find('.dropdown-menu').removeClass('show');
  });

  var progresslevel = function () {
    if (Rs.('div').hasClass('progress-level-bar')) {
    var bars = document.querySelectorAll('.progress-level-bar > span');
    setInterval(function(){
    bars.forEach(function(bar){
      var t1 = parseFloat(bar.dataset.progress);
      var t2 = parseFloat(bar.dataset.max);
      var getWidth = ( t1 / t2) * 100;
      bar.style.width = getWidth + '%';
    });
    }, 500);
  }}

  var collapse_menu = function () {
    Rs.(".button-show-hide").on("click", function () {
      Rs.('.layout-wrap').toggleClass('full-width');
    })
  }

  var fullcheckbox = function () {
    Rs.('.total-checkbox').on('click', function () {
      if ( Rs.(this).is(':checked') ) {
        Rs.(this).closest('.wrap-checkbox').find('.checkbox-item').prop('checked', true);
      } else {
        Rs.(this).closest('.wrap-checkbox').find('.checkbox-item').prop('checked', false);
      }
    });
  };

  var showpass = function() {
    Rs.(".show-pass").on("click", function () {
      Rs.(this).toggleClass("active");
      var input = Rs.(this).parents(".password").find(".password-input");

      if (input.attr("type") === "password") {
        input.attr("type", "text");
      } else if (input.attr("type") === "text") {
        input.attr("type", "password");
      }
    });
  }

  var gallery = function() {
    Rs.(".button-list-style").on("click", function () {
      Rs.(".wrap-gallery-item").addClass("list");
    });
    Rs.(".button-grid-style").on("click", function () {
      Rs.(".wrap-gallery-item").removeClass("list");
    });
  }

  var coppy = function() {
    Rs.(".button-coppy").on("click", function () {
      myFunction()
    });
    function myFunction() {
      var copyText = document.getElementsByClassName("coppy-content");
      navigator.clipboard.writeText(copyText.text);
    }
  }

  var select_colors_theme = function () {
    if (Rs.('div').hasClass("select-colors-theme")) {
      Rs.(".select-colors-theme .item").on("click", function (e) {
        Rs.(this).parents(".select-colors-theme").find(".active").removeClass("active");
        Rs.(this).toggleClass("active");
      })
    }
  }

  var icon_function = function () {
    if (Rs.('div').hasClass("list-icon-function")) {
      Rs.(".list-icon-function .trash").on("click", function (e) {
        Rs.(this).parents(".product-item").remove();
        Rs.(this).parents(".attribute-item").remove();
        Rs.(this).parents(".countries-item").remove();
        Rs.(this).parents(".user-item").remove();
        Rs.(this).parents(".roles-item").remove();
      })
    }
  }

  var box_search=function(){
        
    Rs.(document).on('click',function(e){
      var clickID=e.target.id;if((clickID!=='s')){
          Rs.('.box-content-search').removeClass('active');
      }});
    Rs.(document).on('click',function(e){
        var clickID=e.target.class;if((clickID!=='a111')){
            Rs.('.show-search').removeClass('active');
    }});
        
    Rs.('.show-search').on('click',function(event){
      event.stopPropagation();}
    );
    Rs.('.search-form').on('click',function(event){
      event.stopPropagation();}
    );
    var input =  Rs.('.header-dashboard').find('.form-search').find('input');
    input.on('input', function() {
      if (Rs.(this).val().trim() !== '') {
        Rs.('.box-content-search').addClass('active');
      } else {
        Rs.('.box-content-search').removeClass('active');
      }
    });
   
  }

  var retinaLogos = function() {
    var retina = window.devicePixelRatio > 1 ? true : false;
      if(retina) {
        if (Rs.(".dark-theme").length > 0) {
          Rs.('#logo_header').attr({src:'images/logo/logo.png',width:'154px',height:'52px'});
        } else {
          Rs.('#logo_header').attr({src:'images/logo/logo.png',width:'154px',height:'52px'});
        }
      }
  };  

  var preloader = function () {
    setTimeout(function () {
    Rs.("#preload").fadeOut("slow", function () {
        Rs.(this).remove();
    });
    }, 1000);
  };


  // Dom Ready
  Rs.(function () {
    selectImages();
    menuleft();
    tabs();
    progresslevel();
    collapse_menu();
    fullcheckbox();
    showpass();
    gallery();
    coppy();
    select_colors_theme();
    icon_function();
    box_search();
    retinaLogos();
    preloader();
    
  });

})(jQuery);
