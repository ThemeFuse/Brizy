import jQuery from "jquery";
import "../common/jQuery";
import "slick-carousel";
import "../countdown/jquery.countdown";
import "../countdown2/jquery.countdown";

// In webpack.config is specific what jq is used
// In WP jQuery is added automated with WordPress
// In cloud jQuery is used from node_modules
if (!window.jQuery) {
  window.jQuery = jQuery;
} else {
  const plugins = ["slick", "countdown", "countdown2"];
  plugins.forEach(plugin => {
    if (!window.jQuery.fn[plugin]) {
      window.jQuery.fn[plugin] = jQuery.fn[plugin];
    }
  });
}
