import $ from "jquery";

(function($) {
  var pluginName = "countdown";

  function Plugin(settings) {
    this.settings = $.extend(
      {
        now: new Date().getTime()
      },
      settings
    );

    this._startTime = new Date().getTime();

    this.start();
    this.tick();
  }

  $.extend(Plugin.prototype, {
    start: function() {
      this.intervalId = setInterval(
        this.tick.bind(this),
        this.settings.tickInterval
      );
    },
    update: function(settings) {
      this.settings = $.extend({}, this.settings, settings);
      if (!this.intervalId) this.start();
      this.tick();
    },
    tick: function() {
      var now = this.settings.now + (new Date().getTime() - this._startTime);
      var endDate =
        Number(this.settings.endDate) + Number(this.settings.timeZoneOffset);
      var language = this.settings.language;

      var remaining = endDate - now;
      var isActive = remaining > 0;
      var days = isActive ? Math.floor(remaining / (24 * 60 * 60 * 1000)) : 0;
      var hours = isActive
        ? Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
        : 0;
      var minutes = isActive
        ? Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 1000)) % 60
        : 0;
      var seconds = isActive
        ? (Math.floor((remaining % (24 * 60 * 60 * 1000)) / 1000) % 60) % 60
        : 0;

      this.settings.onTick({
        days: {
          title: language.whichLabels(days)[3],
          amount: days
        },
        hours: {
          title: language.whichLabels(hours)[4],
          amount: hours
        },
        minutes: {
          title: language.whichLabels(minutes)[5],
          amount: minutes
        },
        seconds: {
          title: language.whichLabels(seconds)[6],
          amount: seconds
        }
      });

      if (!isActive) this.destroy();
    },
    destroy: function() {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  });

  $.fn[pluginName] = function(options) {
    var dataKey = "plugin_" + pluginName;
    if (options === undefined || typeof options === "object") {
      return this.each(function() {
        if (!$.data(this, dataKey)) {
          $.data(this, dataKey, new Plugin(options));
        } else {
          $.data(this, dataKey).update(options);
        }
      });
    } else if (
      typeof options === "string" &&
      options[0] !== "_" &&
      options !== "init"
    ) {
      return this.each(function() {
        var instance = $.data(this, dataKey);
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
