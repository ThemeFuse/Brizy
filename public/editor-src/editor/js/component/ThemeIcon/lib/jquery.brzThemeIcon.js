import $ from "jquery";
import { responseToSvg } from "../utils";

(function($, window, document) {
  "use strict";

  var pluginName = "brzThemeIcon";
  var defaults = {
    type: "themeIcon",
    node: window.document.body
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
      $(this.element).each(function() {
        var $this = $(this);
        var href = $this.data().href;

        if (href) {
          $.ajax({
            method: "GET",
            url: href,
            dataType: "text"
          })
            .done(function(res) {
              try {
                var $svg = $(responseToSvg(res));
                var attributes = $this.get(0).attributes;

                for (var i = 0; i < attributes.length; i++) {
                  $svg.attr(attributes[i].nodeName, attributes[i].nodeValue);
                }

                $this.replaceWith($svg);
              } catch (error) {
                console.error(error);
              }
            })
            .fail(function(jqXHR, textStatus) {
              console.warn("Request failed: " + textStatus);
            });
        }
      });
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
