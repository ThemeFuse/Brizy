import $ from "jquery";
import { makeAttr } from "visual/utils/i18n/attribute";

var callbacks = [];
var isAlreadyMounted = false;

function youtubeLoadScript(cb) {
  if (!isAlreadyMounted) {
    if (callbacks.length === 0) {
      const candidate = document.querySelector(
        "script[src='https://www.youtube.com/iframe_api']"
      );

      if (!candidate) {
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://www.youtube.com/iframe_api";

        script.onerror = function () {
          cb(new Error("Failed to load" + script.src));
        };

        document.body.append(script);
      }

      if (window.onYouTubeIframeAPIReady === undefined) {
        window.onYouTubeIframeAPIReady = () => {
          if (window.Brz) {
            window.Brz.emit("plugin.video.iframe.ready");
          }
        };
      }

      if (window.Brz === undefined) {
        window.onYouTubeIframeAPIReady = () => {
          isAlreadyMounted = true;
          callbacks.forEach(function (cb) {
            cb();
          });
        };
      }

      if (window.Brz) {
        window.Brz.on("plugin.video.iframe.ready", () => {
          isAlreadyMounted = true;
          callbacks.forEach(function (cb) {
            cb();
          });
        });
      }
    }

    callbacks.push(cb);
  } else {
    cb();
  }
}

function Youtube($iframe, settings) {
  this._loop = settings.loop;
  this._start = settings.start || 0;
  this._shouldPause = false;
  this._isFinished = false;

  youtubeLoadScript(this._init.bind(this, $iframe));
}

$.extend(Youtube.prototype, {
  _init: function ($iframe) {
    if (!$iframe.get(0)) return;

    this.player = new YT.Player($iframe.get(0), {
      events: {
        onReady: function (event) {
          event.target.mute();
          event.target.seekTo(this._start);
          event.target.playVideo();
          if (this._shouldPause) {
            event.target.pauseVideo();
          } else {
            event.target.playVideo();
          }
        }.bind(this),
        onStateChange: function (event) {
          if (this._loop && event.data == YT.PlayerState.ENDED) {
            event.target.seekTo(this._start);
            event.target.playVideo();
          } else if (!this._loop && event.data == YT.PlayerState.ENDED) {
            this._isFinished = true;
          }
        }.bind(this)
      }
    });
  },
  mute: function () {
    this.player.mute();
  },
  unMute: function () {
    this.player.unMute();
  },
  play: function () {
    if (this._isFinished) {
      return;
    }
    if (this.player && typeof this.player.playVideo === "function") {
      this.player.playVideo();
    }
  },
  stop: function () {
    this.player.stopVideo();
  },
  pause: function () {
    if (this.player && typeof this.player.pauseVideo === "function") {
      this.player.pauseVideo();
    } else {
      this._shouldPause = true;
    }
  },
  setLoop: function (value) {
    this.play();
    this._loop = value;
  },
  seekTo: function (seconds = 0) {
    this._start = seconds;
    this.player.seekTo(seconds);
  },
  destroy: function () {
    // this.player.destroy();
    this.player = null;
  }
});

function Vimeo($iframe, settings) {
  var loop = settings.loop;
  var start = settings.start || 0;
  var isFinished = false;
  var shouldPause = false;

  var sendMessage = function (method, value) {
    const iframe = $iframe.get(0);
    if (!iframe || !iframe.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(
      JSON.stringify({
        method: method,
        value: value
      }),
      "*"
    );
  }.bind(this);

  window.addEventListener(
    "message",
    function (event) {
      if (!event.origin.includes("vimeo")) return;
      var parsedData = JSON.parse(event.data);
      const readyAttr = makeAttr("ready");

      if (parsedData.method === "ping" && !$iframe.attr(readyAttr)) {
        $iframe.attr(readyAttr, "true");
        sendMessage("addEventListener", "loaded");
        sendMessage("addEventListener", "finish");
      }

      switch (parsedData.event) {
        case "ready": {
          if (!$iframe.data("ready")) {
            $iframe.attr(readyAttr, "true");
            sendMessage("addEventListener", "loaded");
            sendMessage("addEventListener", "finish");

            if (shouldPause) {
              sendMessage("pause");
            }
          }
          break;
        }
        case "finish": {
          sendMessage("setCurrentTime", start);
          // hack. Find a better way
          if (loop) {
            setTimeout(
              function () {
                sendMessage("play");
              }.bind(this),
              260
            );
          } else {
            isFinished = true;
          }
          break;
        }
        case "loaded": {
          sendMessage("setCurrentTime", start);
          sendMessage("setVolume", 0);

          if (!shouldPause) {
            sendMessage("play");
          }

          break;
        }
      }
    }.bind(this),
    false
  );

  sendMessage("ping");

  return {
    mute: function () {
      sendMessage("setVolume", 0);
    },
    unMute: function () {
      sendMessage("setVolume", 100);
    },
    play: function () {
      if (!isFinished) {
        sendMessage("play");
      }
    },
    pause: function () {
      sendMessage("pause");
      shouldPause = true;
    },
    setLoop: function (value) {
      this.play();
      loop = value;
    },
    seekTo: function (seconds = 0) {
      start = seconds;
      sendMessage("setCurrentTime", seconds);
    },
    destroy: function () {
      sendMessage("unload");
      sendMessage("removeEventListener", "loaded");
      sendMessage("removeEventListener", "finish");
    }
  };
}

function CustomVideo(video, settings) {
  const loop = settings.loop;
  const start = settings.start || 0;
  const _video = video.find("video")[0];
  let isFinished = false;

  const handleCustomVideoEnded = () => {
    if (isFinished) {
      return;
    }

    if (!loop) {
      return (isFinished = true);
    }

    _video.currentTime = start;
    _video.play();
  };

  if (_video) {
    _video.addEventListener("ended", handleCustomVideoEnded);
    _video.setAttribute("muted", "true");
    _video.currentTime = start;
    _video.play();
  }

  return {
    setLoop: () => {
      if (_video) {
        _video.removeEventListener("ended", handleCustomVideoEnded);
      }
    },
    destroy: () => {
      if (_video) {
        _video.removeEventListener("ended", handleCustomVideoEnded);
        _video.currentTime = 0;
      }
    },
    seekTo: () => {},
    pause: () => {
      if (_video) {
        _video.pause();
      }
    },
    play: () => {
      if (isFinished) {
        return;
      }

      if (_video) {
        _video.play();
      }
    }
  };
}

(function ($, window) {
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
    _init: function (settings) {
      if (!this.$iframe) {
        this.$iframe = this.$elem.find("iframe");
      }
      if (settings.type === "youtube") {
        this._player = new Youtube(this.$iframe, settings);
      } else if (settings.type === "vimeo") {
        this._player = new Vimeo(this.$iframe, settings);
      } else {
        this._player = new CustomVideo(this.$elem, settings);
      }
    },
    _setSizes: function () {
      var size = getSize.call(this);
      if (this.$iframe) {
        this.$iframe
          .width(size.width)
          .height(size.height)
          .css({ left: size.left, top: size.top });
      }

      function getSize() {
        const adminBar = document.getElementById("wpadminbar");

        // This is needed for check preview height section
        if (adminBar) {
          adminBar.style.display = "none";
        }

        var RATIO = 1.78;
        var width = this.$elem.width();
        var height = this.$elem.height();

        if (adminBar) {
          adminBar.style.removeProperty("display");
        }

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
    _attachEvents: function () {
      $(window).on("resize", this._setSizes);
    },
    _detachEvents: function () {
      $(window).off("resize", this._setSizes);
    },

    // api
    refresh: function (type, value) {
      if (type === "typeChange") {
        this._player.destroy();
        this._init(value);
        this._setSizes();
      } else if (type === "resize") {
        this._setSizes();
      } else if (type === "reinit") {
        this.destroy();
        this._init(value);
      } else {
        this._player[type](value);
      }
    },

    destroy: function () {
      this._detachEvents();
      this._player.destroy();
      this.$iframe = null;
      this._player = null;
    }
  });

  $.fn[pluginName] = function (options) {
    if (options === undefined || typeof options === "object") {
      return this.each(function () {
        if (!$.data(this, dataKey)) {
          $.data(this, dataKey, new Plugin(this, options));
        }
      });
    } else if (typeof options === "string" && options === "destroy") {
      return this.each(function () {
        var instance = $.data(this, dataKey);

        if (instance instanceof Plugin) {
          instance.destroy.apply(instance);
        }
      });
    } else {
      var args = Array.prototype.slice.call(arguments, 1)[0];

      return this.each(function () {
        var instance = $.data(this, dataKey);

        if (instance instanceof Plugin) {
          instance.refresh.apply(instance, [options, args]);
        }
      });
    }
  };
})($, window, document);
