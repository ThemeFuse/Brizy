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

    return className => {
      return `<div class="brz-slick-slider__arrow ${className}">${$svg[0].outerHTML}</div>`;
    };
  };

  $node.find(".brz-carousel__slider").each(function() {
    const _this = this;
    const $this = $(this);
    const data = $this.data();
    const slidesToShow = data.slidesToShow;
    const slidesToScroll = data.slidesToScroll;
    const dots = data.dots;
    const dotsClass = data.dotsClass;
    const arrows = data.arrows;
    const fade = data.fade;
    const vertical = data.vertical;
    const autoPlay = data.autoPlay;
    const autoPlaySpeed = data.autoPlaySpeed;
    const swipe = data.swipe;
    const responsive = JSON.parse(decodeURIComponent(data.responsive));

    $this.on("init", function() {
      // when preview is opening via mobile - slick init plugin - then destroy it
      // and init again. this steps remove click lightbox event inside slider.
      // So we should reinitialize lightbox manually
      $this.find(".brz-image__lightbox").each(function() {
        $(this).magnificPopup({
          delegate: "a",
          type: "image",
          closeOnContentClick: true
        });
      });
    });

    const getArrow = makeArrow(_this);

    const $slick = $this.slick({
      slidesToShow,
      slidesToScroll,
      swipe,
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
      rtl: isRtl
    });

    // Need rearrange when changed some of elements [tabs, accordion, ... ]
    const elements = [
      "elements.tabs.changed",
      "elements.accordion.changed",
      "elements.switcher.changed",
      "elements.mmenu.panel.opened"
    ];

    elements.forEach(id => {
      window.Brizy.on(id, element => {
        if (element && element.contains(_this)) {
          $slick.slick("setPosition");
        }
      });
    });
  });
}
