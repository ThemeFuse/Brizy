import jQuery from "jquery";
import "../common/jQuery";
import "slick-carousel";

export { countdown } from "../countdown/countdown";

// In webpack.config is specific what jq is used
// In WP jQuery is added automated with WordPress
// In cloud jQuery is used from node_modules
if (!window.jQuery) {
  window.jQuery = jQuery;
} else {
  const plugins = ["slick"];
  plugins.forEach(plugin => {
    if (!window.jQuery.fn[plugin]) {
      window.jQuery.fn[plugin] = jQuery.fn[plugin];
    }
  });
}
