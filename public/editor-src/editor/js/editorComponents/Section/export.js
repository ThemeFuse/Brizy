import $ from "jquery";

function getArrow(src, className) {
  $.ajax({
    method: "GET",
    url: src,
    dataType: "text"
  })
    .done(function(base64) {
      var svg = "";

      try {
        svg = atob(base64.replace("MC43NDQwMzkxMDQwNjc4MDM0", ""));
      } catch (e) {
        if (/^<svg/.test(base64)) {
          svg = base64;
        } else {
          console.warn(e);
        }
      }

      $('svg[data-href="' + src + '"]').html(svg);
    })
    .fail(function(jqXHR, textStatus) {
      console.warn("Request failed: " + textStatus);
    });

  return (
    '<div class="brz-slick-slider__arrow ' +
    className +
    '"><svg class="brz-icon-svg" data-href="' +
    src +
    '"></svg></div>"'
  );
}

$(".brz-slick-slider, .brz-carousel__slider").each(function() {
  var $this = $(this);
  var data = $this.data();
  var slidesToShow = data.slidesToShow;
  var slidesToScroll = data.slidesToScroll;
  var dots = data.dots;
  var dotsClass = data.dotsClass;
  var arrows = data.arrows;
  var nextArrow = data.nextArrow;
  var prevArrow = data.prevArrow;
  var fade = data.fade;
  var vertical = data.vertical;
  var autoPlay = data.autoPlay;
  var autoPlaySpeed = data.autoPlaySpeed;
  var swipe = data.swipe;

  $this.slick({
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    swipe: swipe,
    draggable: swipe,
    dots: dots,
    dotsClass: dotsClass,
    arrows: arrows,
    nextArrow: nextArrow && getArrow(nextArrow, "brz-slick-slider__arrow-next"),
    prevArrow: prevArrow && getArrow(prevArrow, "brz-slick-slider__arrow-prev"),
    fade: fade,
    vertical: vertical,
    autoplay: autoPlay,
    autoplaySpeed: autoPlaySpeed,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });
});
