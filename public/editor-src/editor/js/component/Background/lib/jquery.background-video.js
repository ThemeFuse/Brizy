import $ from "jquery";

(function($, window, document, undefined) {
  var pluginName = "backgroundVideo";
  var dataKey = "plugin_" + pluginName;

  var defaultSettings = {
    autoResize: true,
    autoplay: false,
    type: "youtube",
    mute: null,
    quality: null
  };
  var playerInits = {
    youtube: function(settings) {
      var mute = settings.mute;
      if (mute) {
        this.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: mute ? "mute" : "unMute"
          }),
          "*"
        );
      }

      var quality = settings.quality;
      if (quality) {
        this.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: "setPlaybackQuality",
            args: ["hd" + quality, true]
          }),
          "*"
        );
      }

      if (settings.autoplay) {
        this.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: "playVideo"
          }),
          "*"
        );
      }
    },
    vimeo: function(settings) {
      var mute = settings.mute;
      if (mute) {
        this.contentWindow.postMessage(
          JSON.stringify({
            method: "setVolume",
            value: mute ? 0 : 100
          }),
          "*"
        );
      }
      if (settings.autoplay) {
        this.contentWindow.postMessage(
          JSON.stringify({
            method: "play"
          }),
          "*"
        );
      }
    }
  };

  function Plugin(elem, settings) {
    this.$elem = $(elem);
    this.settings = $.extend({}, defaultSettings, settings);

    // handlers
    this._handleIframeLoad = this._updateSettings.bind(this);
    this.handleVisibilitychange = this._updateSettings.bind(this);
    this._handleWindowResize = function() {
      this.refresh();
    }.bind(this);

    this._init();
  }

  $.extend(Plugin.prototype, {
    _init: function() {
      this._resizePlayer();
      this._attachEvents();
    },
    _updateSettings: function() {
      var $iframe = this.$elem.find("iframe");
      var initFn = playerInits[this.settings.type];
      initFn.call($iframe.get(0), this.settings);
    },
    _resizePlayer: function() {
      var $iframe = this.$elem.find("iframe");
      var size = getSize.call(this);

      $iframe
        .width(size.width)
        .height(size.height)
        .css({ left: size.left, top: size.top });

      function getSize() {
        var RATIO = 1.78;
        var width = this.$elem.width();
        var height = this.$elem.height();

        if (width / RATIO < height) {
          var pWidth = Math.ceil(height * RATIO);

          return {
            width: pWidth,
            height: height,
            left: (width - pWidth) / 2,
            top: 0
          };
        } else {
          var pHeight = Math.ceil(width / RATIO);

          return {
            width: width,
            height: pHeight,
            left: 0,
            top: (height - pHeight) / 2
          };
        }
      }
    },
    _attachEvents: function() {
      var $iframe = this.$elem.find("iframe");

      $iframe.on("load", this._handleIframeLoad);

      $(window).on("visibilitychange", this.handleVisibilitychange);

      if (this.settings.autoResize) {
        $(window).on("resize", this._handleWindowResize);
      }
    },
    _detachEvents: function() {
      var $iframe = this.$elem.find("iframe");

      $iframe.off("load", this._handleIframeLoad);
      $(window).on("visibilitychange", this.handleVisibilitychange);

      if (this.settings.autoResize) {
        $(window).off("resize", this._resizeHandler);
      }
    },

    // api
    refresh: function(settings) {
      this.settings = $.extend({}, defaultSettings, this.settings, settings);

      this._updateSettings();
      this._resizePlayer();
    },
    destroy: function() {
      this._detachEvents();
      this.$elem.removeData(dataKey);

      this.$elem = null;
      this.settings = null;
      this._handleIframeLoad = null;
      this._handleWindowResize = null;
    }
  });

  $.fn[pluginName] = function(options) {
    if (options === undefined || typeof options === "object") {
      return this.each(function() {
        if (!$.data(this, dataKey)) {
          $.data(this, dataKey, new Plugin(this, options));
        }
      });
    } else if (typeof options === "string" && options[0] !== "_") {
      var args = Array.prototype.slice.call(arguments, 1);

      return this.each(function() {
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
