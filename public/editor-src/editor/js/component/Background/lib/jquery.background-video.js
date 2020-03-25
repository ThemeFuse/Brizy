import $ from "jquery";

var callbacks = [];
var isAlreadyMounted = false;

function youtubeLoadScript(cb) {
  if (!isAlreadyMounted) {
    if (callbacks.length === 0) {
      var script = document.createElement("script");
      script.async = true;
      script.src = "https://www.youtube.com/iframe_api";

      script.onerror = function() {
        cb(new Error("Failed to load" + script.src));
      };

      window.onYouTubeIframeAPIReady = function() {
        isAlreadyMounted = true;
        callbacks.forEach(function(cb) {
          cb();
        });
      };

      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
    }

    callbacks.push(cb);
  } else {
    cb();
  }
}

function Youtube($iframe, settings) {
  this._loop = settings.loop;
  this._start = settings.start || 0;

  youtubeLoadScript(this._init.bind(this, $iframe));
}

$.extend(Youtube.prototype, {
  _init: function($iframe) {
    this.player = new YT.Player($iframe.get(0), {
      events: {
        onReady: function(event) {
          event.target.mute();
          event.target.seekTo(this._start);
          event.target.playVideo();
        }.bind(this),
        onStateChange: function(event) {
          if (this._loop && event.data == YT.PlayerState.ENDED) {
            event.target.seekTo(this._start);
            event.target.playVideo();
          }
        }.bind(this)
      }
    });
  },
  mute: function() {
    this.player.mute();
  },
  unMute: function() {
    this.player.unMute();
  },
  play: function() {
    this.player.playVideo();
  },
  stop: function() {
    this.player.stopVideo();
  },
  pause: function() {
    this.player.pauseVideo();
  },
  setLoop: function(value) {
    this.play();
    this._loop = value;
  },
  seekTo: function(seconds = 0) {
    this._start = seconds;
    this.player.seekTo(seconds);
  },
  destroy: function() {
    // this.player.destroy();
    this.player = null;
  }
});

function Vimeo($iframe, settings) {
  var loop = settings.loop;
  var start = settings.start || 0;

  var sendMessage = function(method, value) {
    $iframe.get(0).contentWindow &&
      $iframe.get(0).contentWindow.postMessage(
        JSON.stringify({
          method: method,
          value: value
        }),
        "*"
      );
  }.bind(this);

  window.addEventListener(
    "message",
    function(event) {
      var parsedData = JSON.parse(event.data);
      switch (parsedData.event) {
        case "ready": {
          sendMessage("addEventListener", "loaded");
          sendMessage("addEventListener", "finish");
          break;
        }
        case "finish": {
          sendMessage("setCurrentTime", start);
          // hack. Find a better way
          if (loop) {
            setTimeout(
              function() {
                sendMessage("play");
              }.bind(this),
              260
            );
          }
          break;
        }
        case "loaded": {
          sendMessage("setCurrentTime", start);
          sendMessage("setVolume", 0);
          sendMessage("play");
          break;
        }
      }
    }.bind(this),
    false
  );

  return {
    mute: function() {
      sendMessage("setVolume", 0);
    },
    unMute: function() {
      sendMessage("setVolume", 100);
    },
    play: function() {
      sendMessage("play");
    },
    pause: function() {
      sendMessage("pause");
    },
    setLoop: function(value) {
      this.play();
      loop = value;
    },
    seekTo: function(seconds = 0) {
      start = seconds;
      sendMessage("setCurrentTime", seconds);
    },
    destroy: function() {
      sendMessage("unload");
      sendMessage("removeEventListener", "loaded");
      sendMessage("removeEventListener", "finish");
    }
  };
}

(function($, window) {
  var pluginName = "backgroundVideo";
  var dataKey = "plugin_" + pluginName;

  function Plugin(elem, settings) {
    this.$elem = $(elem);
    this.$iframe = this.$elem.find("iframe");

    this._setSizes = this._setSizes.bind(this);

    this._setSizes();
    this._attachEvents();
    this._init(settings);
  }

  $.extend(Plugin.prototype, {
    _init: function(settings) {
      if (settings.type === "youtube") {
        this._player = new Youtube(this.$iframe, settings);
      } else if (settings.type === "vimeo") {
        this._player = new Vimeo(this.$iframe, settings);
      }
    },
    _setSizes: function() {
      var size = getSize.call(this);

      this.$iframe
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
      $(window).on("resize", this._setSizes);
    },
    _detachEvents: function() {
      $(window).off("resize", this._setSizes);
    },

    // api
    refresh: function(type, value) {
      if (type === "typeChange") {
        this._player.destroy();
        this._init(value);
      } else if (type === "resize") {
        this._setSizes();
      } else {
        this._player[type](value);
      }
    },

    destroy: function() {
      this._detachEvents();
      this._player.destroy();
      this.$iframe = null;
      this._player = null;
    }
  });

  $.fn[pluginName] = function(options) {
    if (options === undefined || typeof options === "object") {
      return this.each(function() {
        if (!$.data(this, dataKey)) {
          $.data(this, dataKey, new Plugin(this, options));
        }
      });
    } else if (typeof options === "string" && options === "destroy") {
      return this.each(function() {
        var instance = $.data(this, dataKey);

        if (instance instanceof Plugin) {
          instance.destroy.apply(instance);
        }
      });
    } else {
      var args = Array.prototype.slice.call(arguments, 1)[0];

      return this.each(function() {
        var instance = $.data(this, dataKey);

        if (instance instanceof Plugin) {
          instance.refresh.apply(instance, [options, args]);
        }
      });
    }
  };
})($, window, document);
