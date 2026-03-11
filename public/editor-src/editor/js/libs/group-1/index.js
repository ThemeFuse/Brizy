import Flatpickr from "flatpickr";
import jQuery from "jquery";
import Scrollbars from "perfect-scrollbar";
import select2 from "select2";
import "../common/jQuery";

// Select2 exports a function that must be called to attach the plugin to jQuery
select2(undefined, jQuery);

// In webpack.config is specific what jq is used
// In WP jQuery is added automated with WordPress
// In cloud jQuery is used from node_modules
if (!window.jQuery) {
  window.jQuery = jQuery;
} else {
  const plugins = ["select2"];
  plugins.forEach((plugin) => {
    if (!window.jQuery.fn[plugin]) {
      window.jQuery.fn[plugin] = jQuery.fn[plugin];
    }
  });
}

export { Flatpickr, Scrollbars };
