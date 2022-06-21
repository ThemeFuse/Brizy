import jQuery from "jquery";
import "../common/jQuery";
import "magnific-popup";
import { Motions } from "@brizy/motion";

export * from "../animation";
export { Motions };

// In webpack.config is specific what jq is used
// In WP jQuery is added automated with WordPress
// In cloud jQuery is used from node_modules
if (!window.jQuery) {
  window.jQuery = jQuery;
} else {
  const plugins = ["magnificPopup"];
  plugins.forEach(plugin => {
    if (!window.jQuery.fn[plugin]) {
      window.jQuery.fn[plugin] = jQuery.fn[plugin];
    }
  });
}
