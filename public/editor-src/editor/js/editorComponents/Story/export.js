import $ from "jquery";

export default function($node) {
  const isRtl = $node.closest("[dir='rtl']").length > 0;
  const makeArrow = node => {
    const $svg = $(node)
      .children(".brz-icon-svg")
      .removeClass("brz-hidden");

    // Delete Svg
    $(node)
      .children(".brz-icon-svg")
      .remove();

    return className =>
      className === "brz-slick-slider__arrow-next" && $svg.length > 1
        ? `<div class="brz-slick-slider__arrow ${className}">${$svg[0].outerHTML}</div>
           <div class="brz-slick-slider__arrow brz-slick-slider__arrow-replay">${$svg[1].outerHTML}</div>`
        : `<div class="brz-slick-slider__arrow ${className}">${$svg[0].outerHTML}</div>`;
  };
  const handleResize = $node => {
    const { innerWidth, innerHeight } = window;

    if (innerWidth < 768) {
      const $slide = $node.find(".slick-slide");
      const docHeight = innerHeight;
      const slideHeight = $slide.height();

      if (docHeight !== slideHeight) {
        $slide.css("height", docHeight);
      }
    }
  };
  const handlePrevent = e => {
    e.preventDefault();
  };

  $node.find(".brz-slick-slider__story").each(function() {
    const _this = this;
    const $this = $(this);
    const {
      centerMode,
      centerPadding,
      variableWidth,
      focusOnSelect,
      touchThreshold,
      slidesToShow,
      infinite,
      slidesToScroll,
      lazyLoad,
      dots,
      dotsClass,
      arrows,
      fade,
      vertical,
      autoPlay,
      autoPlaySpeed,
      swipe,
      speed,
      responsive: _responsive
    } = $this.data();
    const responsive = JSON.parse(decodeURIComponent(_responsive));
    const getArrow = makeArrow(_this);

    $this.on("init", function() {
      handleResize($this);
    });

    $this.on("breakpoint", function() {
      handleResize($this);
    });

    const $slideshow = $this.slick({
      centerMode,
      centerPadding,
      variableWidth,
      focusOnSelect,
      touchThreshold,
      slidesToShow,
      infinite,
      slidesToScroll,
      lazyLoad,
      swipe,
      speed,
      dots,
      dotsClass,
      arrows,
      fade,
      vertical,
      responsive,
      draggable: swipe,
      nextArrow: arrows && getArrow("brz-slick-slider__arrow-next"),
      prevArrow: arrows && getArrow("brz-slick-slider__arrow-prev"),
      autoplay: autoPlay,
      autoplaySpeed: autoPlaySpeed,
      rtl: isRtl,
      rows: 0
    });

    $(".brz-slick-slider__arrow-replay").on("click", function() {
      $slideshow.slick("slickGoTo", 0);
    });

    $(".brz-slick-slider__inner-arrow-next").on("click", function(e) {
      e.stopPropagation();
      e.preventDefault();
      $slideshow.slick("slickNext");
    });

    $(".brz-slick-slider__inner-arrow-prev").on("click", function(e) {
      e.stopPropagation();
      e.preventDefault();
      $slideshow.slick("slickPrev");
    });

    // Disable Vertical touch move
    window.addEventListener("touchmove", handlePrevent, { passive: false });
  });
}
