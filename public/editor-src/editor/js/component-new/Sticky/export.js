import $ from "jquery";
import { observer } from "./utils";

(function($, window, document, undefined) {
  var pluginName = "brzSticky";
  var defaults = {
    type: "animated",
    refNode: function() {
      throw new Error("brzSticky refNode must be specified");
    },
    onStickyChange: function() {}
  };

  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  $.extend(Plugin.prototype, {
    init: function() {
      this.isSticky = false;
      observer.addListener(this.checkSticky.bind(this));
    },
    checkSticky: function() {
      var type = this.settings.type;
      var refNode = this.settings.refNode.call(this.element);
      var refNodeRect = refNode.getBoundingClientRect();
      var isSticky =
        type === "animated"
          ? -refNodeRect.top >= refNodeRect.height
          : refNodeRect.top <= 0;

      if (isSticky !== this.isSticky) {
        this.isSticky = isSticky;
        this.settings.onStickyChange.call(this.element, this.isSticky);
      }
    }
  });

  $.fn[pluginName] = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };
})($, window, document);
