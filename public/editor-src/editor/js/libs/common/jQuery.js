import jQuery from "jquery";

// In webpack.config is specific what jq is used
// In WP jQuery is added automated with wordpress
// In cloud jQuery is used from node_modules
if (!window.jQuery) {
  window.jQuery = jQuery;
} else {
  const plugins = ["scrollPane", "backgroundVideo", "brzParallax", "brzSticky"];

  plugins.forEach((plugin) => {
    if (!window.jQuery.fn[plugin]) {
      window.jQuery.fn[plugin] = jQuery.fn[plugin];
    }
  });
}
