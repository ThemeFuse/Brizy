import $ from "jquery";

(function($, window, document, undefined) {
  var pluginName = "scrollPane";

  function Plugin(elem) {
    this.elem = elem;
    this.scrolableElem = this.elem.firstElementChild;

    this.options = {
      onlyWide: false,
      wideTrackClassName: "brz-ed-wide-track",
      wideThumbClassName: "brz-ed-wide-thumb",
      tallTrackClassName: "brz-ed-tall-track",
      tallThumbClassName: "brz-ed-tall-thumb"
    };

    this.init();
  }

  var _wheel_speed = 1;

  var _math = function(client, offset, scroll, position, track) {
    // In Google Chrome, sometimes scrollSize is less than clientSize by 1
    scroll = Math.max(scroll, client);
    var overflow = scroll - client,
      thumb = (client / scroll) * track,
      piece = track - thumb,
      shift = overflow == 0 ? 0 : (position / overflow) * piece;
    return {
      client: client,
      offset: offset,
      scroll: scroll,
      overflow: overflow,
      position: position,
      track: track,
      thumb: thumb,
      piece: piece,
      shift: shift
    };
  };

  Plugin.prototype.init = function() {
    var ua = navigator.userAgent.toLowerCase();
    var isFirefox = /firefox/.test(ua);
    var isChrome = /chrome/.test(ua);

    if (isFirefox) _wheel_speed = 20;
    if (isChrome) _wheel_speed = 0.8;

    this.onUpdateDOM();

    $(this.elem).on("wheel", this.onWheel.bind(this));
    $(this.scrolableElem).on("scroll", this.onUpdateDOM.bind(this));
  };

  Plugin.prototype.destroy = function() {
    $(this.elem).off("wheel");
    $(this.scrolableElem).off("scroll");
  };

  Plugin.prototype.onWheel = function(event) {
    var top = this.scrolableElem.scrollTop,
      left = this.scrolableElem.scrollLeft;
    if (this.options.onlyWide) {
      this.scrolableElem.scrollLeft =
        left +
        (event.originalEvent.deltaX
          ? event.originalEvent.deltaX
          : event.originalEvent.deltaY * _wheel_speed);
    } else {
      event.preventDefault();
      this.scrolableElem.scrollTop =
        top + event.originalEvent.deltaY * _wheel_speed;
      this.scrolableElem.scrollLeft = left + event.originalEvent.deltaX;
    }
    if (
      this.scrolableElem.scrollTop != top ||
      this.scrolableElem.scrollLeft != left ||
      this.options.onlyWide
    ) {
      event.preventDefault();
    }
  };

  Plugin.prototype.onUpdateDOM = function() {
    var wideTrack = this.elem.getElementsByClassName(
        this.options.wideTrackClassName
      )[0],
      wideTrackHeight,
      wideThumb = this.elem.getElementsByClassName(
        this.options.wideThumbClassName
      )[0],
      tallTrack = this.elem.getElementsByClassName(
        this.options.tallTrackClassName
      )[0],
      tallTrackWidth,
      tallThumb = this.elem.getElementsByClassName(
        this.options.tallThumbClassName
      )[0],
      wide = {
        overflow: Math.max(
          0,
          this.scrolableElem.scrollWidth - this.scrolableElem.clientWidth
        )
      },
      tall = {
        overflow: Math.max(
          this.scrolableElem.scrollHeight - this.scrolableElem.clientHeight
        )
      };

    wideTrack.style.position = "absolute";
    tallTrack.style.position = "absolute";
    wideThumb.style.position = "relative";
    tallThumb.style.position = "relative";

    wideTrack.style.display = "block";
    wideTrackHeight = wideTrack.offsetHeight;
    tallTrack.style.display = "block";
    tallTrackWidth = tallTrack.offsetWidth;

    this.scrolableElem.style.overflow = "hidden";
    this.scrolableElem.style.borderBottomWidth = wideTrackHeight + "px";
    this.scrolableElem.style.borderBottomStyle = wide.overflow
      ? "solid"
      : "none";
    this.scrolableElem.style.borderRightWidth = tallTrackWidth + "px";
    this.scrolableElem.style.borderRightStyle = tall.overflow
      ? "solid"
      : "none";

    // Previous step may lead to changing clientWidth/clientHeight
    wide.overflow = Math.max(
      0,
      this.scrolableElem.scrollWidth - this.scrolableElem.clientWidth
    );
    tall.overflow = Math.max(
      0,
      this.scrolableElem.scrollHeight - this.scrolableElem.clientHeight
    );

    wideTrack.style.display = wide.overflow ? "block" : "none";
    wideTrack.style.width = this.scrolableElem.clientWidth + "px";
    wideTrack.style.left = 0;
    wideTrack.style.top =
      this.scrolableElem.offsetHeight - wideTrackHeight + "px";

    tallTrack.style.display = tall.overflow ? "block" : "none";
    tallTrack.style.height = this.scrolableElem.clientHeight + "px";
    tallTrack.style.top = 0;
    // Previous step may lead to changing  track sizes
    wide = _math(
      this.scrolableElem.clientWidth,
      this.scrolableElem.offsetWidth,
      this.scrolableElem.scrollWidth,
      this.scrolableElem.scrollLeft,
      wideTrack.clientWidth
    );
    tall = _math(
      this.scrolableElem.clientHeight,
      this.scrolableElem.offsetHeight,
      this.scrolableElem.scrollHeight,
      this.scrolableElem.scrollTop,
      tallTrack.clientHeight
    );
    wideThumb.style.left = wide.shift + "px";
    wideThumb.style.width = wide.thumb + "px";
    tallThumb.style.top = tall.shift + "px";
    tallThumb.style.height = tall.thumb + "px";
  };

  $.fn[pluginName] = function(options) {
    var $this = $(this),
      dataKey = "plugin_" + pluginName;
    if (options === undefined || typeof options === "object") {
      return this.each(function() {
        if (!$this.data(dataKey)) {
          $this.data(dataKey, new Plugin(this, options));
        }
      });
    } else if (
      typeof options === "string" &&
      options[0] !== "_" &&
      options !== "init"
    ) {
      return this.each(function() {
        var instance = $this.data(dataKey);
        if (
          instance instanceof Plugin &&
          typeof instance[options] === "function"
        ) {
          instance[options].apply(
            instance,
            Array.prototype.slice.call(arguments, 1)
          );
        }
      });
    }
  };
})($, window, document);
