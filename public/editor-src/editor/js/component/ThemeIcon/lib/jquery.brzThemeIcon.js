import $ from "jquery";
import { responseToSvg } from "../utils";

const removeAttrs = (node, attrs) => {
  attrs.forEach(attr => {
    node.removeAttribute(attr);
  });

  return node;
};

(function($, window) {
  "use strict";

  const pluginName = "brzThemeIcon";
  const defaults = {
    type: "themeIcon",
    node: window.document.body,
    forceInit: false
  };

  function Plugin(element, options) {
    this.element = element;
    this.settings = $.extend({}, defaults, options);

    this.init();
  }

  $.extend(Plugin.prototype, {
    init: function() {
      $(this.element).each(function() {
        const $this = $(this);
        const data = $this.data();
        const href = data.href;
        const id = data.id;

        if (id) {
          try {
            const doc = $("#" + id).html();
            let $svg = $(responseToSvg(doc));
            const node = removeAttrs($this.get(0), ["id"]);
            const attributes = node.attributes;

            for (let i = 0; i < attributes.length; i++) {
              $svg.attr(attributes[i].nodeName, attributes[i].nodeValue);
            }

            $this.replaceWith($svg);
          } catch (error) {
            /* eslint-disable no-console */
            console.error(error);
            /* eslint-enabled no-console */
          }
        } else if (href) {
          $.ajax({
            method: "GET",
            url: href,
            dataType: "text"
          })
            .done(function(res) {
              try {
                let $svg = $(responseToSvg(res));
                const node = removeAttrs($this.get(0), ["data-href"]);
                const attributes = node.attributes;

                for (let i = 0; i < attributes.length; i++) {
                  $svg.attr(attributes[i].nodeName, attributes[i].nodeValue);
                }

                $this.replaceWith($svg);
              } catch (error) {
                /* eslint-disable no-console */
                console.error(error);
                /* eslint-enabled no-console */
              }
            })
            .fail(function(jqXHR, textStatus) {
              /* eslint-disable no-console */
              console.warn("Request failed: " + textStatus);
              /* eslint-enabled no-console */
            });
        }
      });
    }
  });

  $.fn[pluginName] = function(options) {
    const forceInit = options && options.forceInit;

    return this.each(function() {
      if (!$.data(this, "plugin_" + pluginName) || forceInit) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
  };
})($, window, document);
