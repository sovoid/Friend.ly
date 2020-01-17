/*
	Construct by Pixelarity
	pixelarity.com | hello@pixelarity.com
	License: pixelarity.com/license
*/

(function($) {
  var $window = $(window),
    $body = $("body");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: [null, "480px"]
  });

  // Play initial animations on page load.
  $window.on("load", function() {
    window.setTimeout(function() {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Fix: Enable IE flexbox workarounds.
  if (browser.name == "ie") $body.addClass("is-ie");

  // Highlights.
  let hidden = [];
  (function() {
    function lazyLoad() {
      let all = Array.from($(".highlights > section"));
      all.forEach(el => {
        var $this = $(el),
          $image = $this.find(".image"),
          $img = $image.find("img"),
          x;
        var scrollTop = $(window).scrollTop(),
          elementOffset = $img.offset().top,
          distance = elementOffset - scrollTop;
        if (distance < 800 && $image.css("background-image") == "none") {
          // Assign image.
          $image.css("background-image", "url(" + $img.attr("data-src") + ")");

          // Set background position.
          if ((x = $img.data("position"))) $image.css("background-position", x);

          // Hide <img>.
          $img.hide();
          hidden.push($img);
        }
        if (hidden.length == all.length) {
          $(window).off("scroll", lazyLoad);
        }
      });
    }
    lazyLoad();
    $(window).on("scroll", lazyLoad);
  })();
})(jQuery);
