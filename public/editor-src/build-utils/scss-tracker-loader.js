/**
 * SCSS Tracker Loader
 *
 * This Webpack loader tracks SCSS file imports during module compilation.
 * It works by injecting JavaScript code that registers the SCSS module
 * with SCSSSheet when the module is loaded.
 *
 * Key Approach:
 * - The loader runs in the chain and generates a JavaScript module
 * - When imported, this module registers the SCSS path with SCSSSheet
 * - The SCSS compilation continues normally via subsequent loaders
 *
 * Configuration:
 * - trackImports: boolean - Enable/disable tracking (default: true)
 * - isPro: boolean - Whether this is a pro build (default: false)
 */

const path = require("path");

module.exports = function scssTrackerLoader(source) {
  // Return original SCSS source unchanged
  // The tracking happens via the pitch function
  return source;
};

/**
 * Pitch function - runs BEFORE loaders in the chain
 * This is where we inject the tracking side-effect
 */
module.exports.pitch = function () {
  const modulePath = this.resourcePath;
  const options = this.getOptions() || {};
  const { trackImports = false, isPro = false } = options;

  // Only track imports if enabled
  if (!trackImports) {
    return;
  }

  // Extract chunk name from query parameter (e.g., ?componentId=Button)
  const queryParams = new URLSearchParams(this.resourceQuery || "");
  const chunk = queryParams.get("chunk");
  const componentId = queryParams.get("componentId");
  const groupName = queryParams.get("group") ?? "";
  const onlyEditor = queryParams.get("onlyEditor") || false;

  if (onlyEditor) {
    return;
  }

  // Use chunk name if provided, otherwise fall back to filename
  const chunkName =
    chunk || path.basename(modulePath, ".scss").replace(/^_/, "");
  const cssFileName = `${chunkName}.min.css`;
  const relativeCssPath = path.join("css", cssFileName).replace(/\\/g, "/");
  const assetUrl = path.join("editor", relativeCssPath).replace(/\\/g, "/");

  // Generate a JavaScript module that:
  // 1. Registers this SCSS file with SCSSSheet
  // 2. Imports the actual SCSS (which gets processed by other loaders)
  const trackingModule = `
// Auto-generated SCSS tracker for: ${path.basename(modulePath)}
import { SCSSSheet } from 'visual/providers/StyleProvider/SCSSSheet';

// Register this SCSS module
SCSSSheet.register({
  modulePath: '${assetUrl}',
  componentId: '${componentId}',
  chunkName: '${chunkName}',
  groupName: '${groupName}'
}, ${isPro});

export default {};
`;

  return trackingModule;
};
