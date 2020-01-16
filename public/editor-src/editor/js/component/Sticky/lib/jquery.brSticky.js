import $ from "jquery";
import { observer } from "../utils";

(function($) {
  const pluginName = "brzSticky";
  const defaults = {
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
      const type = this.settings.type;
      const refNode = this.settings.refNode.call(this.element);
      const refNodeRect = refNode.getBoundingClientRect();
      const isSticky =
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
