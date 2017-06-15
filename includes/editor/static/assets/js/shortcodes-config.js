__SHORTCODES_CONFIG__['Slider1.owlCarousel'] = {
  items: 1,
  smartSpeed: 550,
  nav: true,
  dots: true,
  loop: true,
  autoplay: true,
  autoplayHoverPause: true,
  autoplayTimeout: 5000,
  autoHeight: true,
  mouseDrag: false,
  // animateOut: 'fadeOut',
  // animateIn: 'fadeOut',
  additionally: {
    320: {
      minHeight: 180,
      fullHeight: false
    },
    479: {
      minHeight: 180,
      fullHeight: false
    },
    767: {
      minHeight: 720,
      maxHeight: 900,
      fullHeight: true
    },
    991: {
      minHeight: 500,
      maxHeight: 1000,
      fullHeight: true
    }
  },

  onInitialize: function () {
    if (!this.$element.find("div[data-item='owl-slide-number-1']").get(0)) this.settings.autoplay = false;
  },
  onInitialized: function () {
    this.onResize();
  }
};

__SHORTCODES_CONFIG__['Slider2.owlCarousel'] = {
  items: 1,
  smartSpeed: 550,
  nav: true,
  dots: true,
  loop: true,
  autoplay: true,
  autoplayHoverPause: true,
  autoplayTimeout: 5000,
  autoHeight: true,
  mouseDrag: false,
  // animateOut: 'fadeOut',
  // animateIn: 'fadeOut',
  additionally: {
    320: {
      minHeight: 435,
      fullHeight: false
    },
    479: {
      minHeight: 435,
      fullHeight: false
    },
    767: {
      minHeight: 720,
      maxHeight: 900,
      fullHeight: true
    },
    991: {
      minHeight: 500,
      fullHeight: true
    }
  },

  onInitialize: function () {
    if (!this.$element.find("div[data-item='owl-slide-number-1']").get(0)) this.settings.autoplay = false;
  },
  onInitialized: function () {
    this.onResize();
  }
};


 __SHORTCODES_CONFIG__['Slider3.owlCarousel'] = {
  smartSpeed: 550,
  nav: false,
  dots: true,
  dotsEach: 1,
  loop: true,
  autoplay: true,
  mouseDrag: true,
};
