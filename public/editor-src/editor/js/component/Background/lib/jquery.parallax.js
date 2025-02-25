import $ from "jquery";
import { attachResize, detachResize } from "./attachResize";
import { attachWheel, detachWheel } from "./attachWheel";

const parallaxInitClassName = "brz-bg-image-parallax--init";

// Parallax
(function ($, window, document) {
  var pluginName = "parallax";
  var dataKey = "plugin_" + pluginName;

  function Plugin(elem, settings) {
    this.$elem = $(elem);
    this.options = $.extend(
      {
        bgClass: "parallax-bg",
        wheelIgnoreClass: [],
        items: [],
        baseElement: window,
        windowHeight: Math.max(
          document.documentElement.clientHeight,
          window.innerHeight || 0
        ),
        r: 0,
        u: 0,
        v: 0,
        s: false,
        F: false
      },
      settings
    );

    // bind event handlers
    this._handleScrollBound = this._handleScroll.bind(this);
    this._handleWheelBound = this._handleWheel.bind(this);
    this._handleResizeBound = this._handleResize.bind(this);

    this._init();
  }

  $.extend(Plugin.prototype, {
    _init: function () {
      this.options.windowHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );

      const htmlTag = document.querySelector("html");

      if (htmlTag) {
        // scroll-behavior: "smooth" does not work with this lib
        htmlTag.style.scrollBehavior = "initial";
      }

      this.profileParallaxElements();
      this._attachEvents();
      this.d();
    },
    _attachEvents: function () {
      const element = this.$elem.get(0);
      this.options.baseElement.addEventListener(
        "scroll",
        this._handleScrollBound,
        false
      );

      attachWheel(element, this._handleWheelBound);
      attachResize(element, this._handleResizeBound);
    },
    _detachEvents: function () {
      const element = this.$elem.get(0);
      this.options.baseElement.removeEventListener(
        "scroll",
        this._handleScrollBound,
        false
      );

      detachWheel(element);
      detachResize(element);
    },
    _handleScroll: function () {
      this.options.F = true;
    },
    _handleWheel: function (event) {
      var y = 2,
        z = 4;

      if (
        this.options.wheelIgnoreClass &&
        this.options.wheelIgnoreClass.length > 0 &&
        $(event.target).closest("." + this.options.wheelIgnoreClass.join(", ."))
          .length > 0
      ) {
        return null;
      }

      event.preventDefault && event.preventDefault(),
        (this.options.v = event.notRealWheel
          ? -event.deltaY / 4
          : 1 === event.deltaMode
            ? -event.deltaY / 3
            : 100 === Math.abs(event.deltaY)
              ? -event.deltaY / 120
              : -event.deltaY / 40),
        (this.options.v = -y > this.options.v ? -y : this.options.v),
        (this.options.v = this.options.v > y ? y : this.options.v),
        (this.options.s = true),
        (this.options.u = z);
    },
    _handleResize: function () {
      this.options.windowHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      this.options.r = this.b();
      this.profileParallaxElements();
    },

    profileParallaxElements: function () {
      var $elem = this.$elem,
        _this = this;

      this.options.items = [];
      this.options.r = this.b();

      $elem.find("." + this.options.bgClass).each(function () {
        var parentElem = $elem,
          top = parentElem.offset().top,
          differenceHeight = _this.getHeight(parentElem),
          isFirstSection = false,
          $node = $(this);

        if (differenceHeight) {
          _this.setHeight(parentElem, differenceHeight);
        }

        _this.options.items.push({
          section: parentElem.get(0),
          outerHeight: parentElem.outerHeight(),
          elemTop: top,
          elemBottom: top + parentElem.outerHeight(),
          isFirstSection: isFirstSection ? !0 : !1,
          imageHolder: this
        });

        $node.addClass(parallaxInitClassName);
        _this.mr_setTranslate3DTransform(
          $node.get(0),
          (_this.f() + _this.options.windowHeight - top) / 2
        );
      });
    },
    setHeight: function (elem, differenceHeight) {
      $(elem)
        .find("." + this.options.bgClass)
        .css({ height: 100 * differenceHeight + "vh" });
    },
    getHeight: function (elem) {
      var $elem = $(elem),
        windowHeight = $(this.options.baseElement).height(),
        elemHeight = $elem.height(),
        differenceHeight = elemHeight / windowHeight;
      return elemHeight > windowHeight ? differenceHeight : null;
    },
    getTransformStyle: function (transformArray) {
      for (var i = 0; i < transformArray.length; i++)
        if ("undefined" != typeof document.body.style[transformArray[i]])
          return transformArray[i];
      return null;
    },
    getScrollingState: function () {
      return this.options.u > 0 ? !0 : !1;
    },
    getCurrentElement: function (elem) {
      for (
        var idx = 0, l = this.options.items.length;
        this.options.items[idx] && this.options.items[idx].section !== elem;
        idx++
      );
      return idx === l ? -1 : idx;
    },
    isFunction: function (type) {
      var object = {};
      return type && "[object Function]" === object.toString.call(type);
    },
    requestAnimationFrame: function (animation) {
      var animationFrame =
        this.options.baseElement.requestAnimationFrame ||
        this.options.baseElement.mozRequestAnimationFrame ||
        this.options.baseElement.webkitRequestAnimationFrame ||
        this.options.baseElement.msRequestAnimationFrame;
      return animationFrame(animation);
    },
    mr_setTranslate3DTransform: function (a, Y) {
      var browserTransformStyle = this.getTransformStyle([
        "transform",
        "msTransform",
        "webkitTransform",
        "mozTransform",
        "oTransform"
      ]);
      a.style[browserTransformStyle] = "translate3d(0," + Y + "px,0)";
    },

    // api
    refresh: function () {
      this.profileParallaxElements();
    },
    destroy: function () {
      this._detachEvents();

      this.$elem.removeData(dataKey);
      this.$elem
        .find("." + this.options.bgClass)
        .css({ height: "", transform: "" })
        .removeClass(parallaxInitClassName);
    },
    paused: function (paused) {
      if (paused) {
        this._detachEvents();
      } else {
        this._attachEvents();
      }
    },
    e: function (a, b) {
      var e = this.isVariant();
      e
        ? b + this.options.windowHeight - this.options.r > a.elemTop &&
          b - this.options.r < a.elemBottom &&
          (a.isFirstSection
            ? this.mr_setTranslate3DTransform(a.imageHolder, b / 2)
            : this.mr_setTranslate3DTransform(
                a.imageHolder,
                b - a.elemTop - this.options.r
              ) / 2)
        : b + this.options.windowHeight > a.elemTop &&
          b < a.elemBottom &&
          (a.isFirstSection
            ? this.mr_setTranslate3DTransform(a.imageHolder, b / 2)
            : this.mr_setTranslate3DTransform(
                a.imageHolder,
                (b + this.options.windowHeight - a.elemTop) / 2
              ));
    },
    c: function (a, b, c, d) {
      var e = a - 1;
      return (
        (e /= d),
        (a /= d),
        e--,
        a--,
        c * (a * a * a * a * a + 1) + b - (c * (e * e * e * e * e + 1) + b)
      );
    },
    d: function () {
      var A = 300,
        B = 1,
        C = 30,
        D = 0;
      if (this.options.F) {
        for (var a = this.options.items.length, b = this.f(); a--; )
          this.e(this.options.items[a], b);
        this.options.F = !1;
      }
      this.options.s &&
        ((D += -this.options.v * this.c(this.options.u, 0, A, C)),
        (D > B || -B > D) &&
          (this.options.baseElement.scrollBy(0, Math.round(D)), (D = 0)),
        this.options.u++,
        this.options.u > C &&
          ((this.options.u = 0),
          (this.options.s = false),
          (this.options.v = 0),
          (D = 0)));
      this.requestAnimationFrame.call(this, this.d.bind(this));
    },
    isVariant: function () {
      return false;
    },
    b: function () {
      return $(this.options.baseElement).outerHeight(true);
    },
    f: function () {
      return this.options.baseElement != window
        ? this.options.baseElement.scrollTop
        : 0 === document.documentElement.scrollTop
          ? document.body.scrollTop
          : document.documentElement.scrollTop;
    }
  });

  $.fn[pluginName] = function (options) {
    if (options === undefined || typeof options === "object") {
      return this.each(function () {
        if (!$.data(this, dataKey)) {
          $.data(this, dataKey, new Plugin(this, options));
        }
      });
    } else if (
      typeof options === "string" &&
      options[0] !== "_" &&
      options !== "init"
    ) {
      var args = Array.prototype.slice.call(arguments, 1);

      return this.each(function () {
        var instance = $.data(this, dataKey);

        if (
          instance instanceof Plugin &&
          typeof instance[options] === "function"
        ) {
          instance[options].apply(instance, args);
        }
      });
    }
  };
})($, window, document);
