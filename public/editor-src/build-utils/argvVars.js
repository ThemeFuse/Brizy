const path = require("path");

module.exports = function (argv) {
  const argv_ = require("minimist")(argv.slice(2));

  /**
   * @type {"WP" | "Cloud" | "Cloud-localhost"}
   */
  const TARGET = argv_.target || argv_.t || "Cloud-localhost";
  const IS_PRODUCTION = Boolean(argv_.production);
  const IS_EXPORT = Boolean(argv_.export || argv_.e);
  const IS_PRO = Boolean(argv_.pro || argv_.p);
  const VERSION = argv_.version;
  const VERSION_PRO = argv_["version-pro"];
  const BUILD_DIR = argv_["build-dir"];
  const BUILD_DIR_PRO = argv_["build-dir-pro"];
  const NO_WATCH = argv_["watch"] === false;
  const NO_VERIFICATION = argv_["verification"] === false;
  const PORT = argv_.port || 3000;
  const ANALYZE_EXPORT = Boolean(argv_["analyze_export"]);
  const ANALYZE_PREVIEW = Boolean(argv_["analyze_preview"]);
  const ANALYZE_EDITOR = Boolean(argv_["analyze_editor"]);
  const AUTHORIZATION_URL = argv_["authUrl"]; // https://auth.brizylocal.com/authorize
  const CHECK_BUNDLE_SIZE = Boolean(argv_["check-bundle-size"]);
  const WITH_TRANSLATIONS = Boolean(argv_["with-translations"]);

  const paths = {
    editor: path.resolve(__dirname, "../editor"),
    packages: path.resolve(__dirname, "../../packages"),
    build: getBuildPath(),
    buildPro: getBuildProPath(),
    buildLocal: path.resolve(__dirname, "../build")
  };

  return {
    TARGET,
    IS_PRODUCTION,
    IS_EXPORT,
    IS_PRO,
    VERSION,
    VERSION_PRO,
    BUILD_DIR,
    BUILD_DIR_PRO,
    NO_WATCH,
    NO_VERIFICATION,
    PORT,
    ANALYZE_EXPORT,
    ANALYZE_PREVIEW,
    ANALYZE_EDITOR,
    AUTHORIZATION_URL,
    CHECK_BUNDLE_SIZE,
    WITH_TRANSLATIONS,
    paths
  };

  function getBuildPath() {
    let r;

    if (TARGET === "WP" && !IS_PRODUCTION) {
      if (BUILD_DIR) {
        r = path.isAbsolute(BUILD_DIR)
          ? BUILD_DIR
          : path.resolve(__dirname, BUILD_DIR);
      } else {
        r = path.resolve(
          __dirname,
          "../../../wordpress/www/wp-content/plugins/brizy/public/editor-build"
        );
      }

      r = path.resolve(r, "./dev");
    } else {
      if (BUILD_DIR) {
        r = path.isAbsolute(BUILD_DIR)
          ? BUILD_DIR
          : path.resolve(__dirname, BUILD_DIR);
      } else {
        r = path.resolve(__dirname, "../build/free");
      }
    }

    return r;
  }

  function getBuildProPath() {
    let r;

    if (TARGET === "WP" && !IS_PRODUCTION) {
      if (BUILD_DIR_PRO) {
        r = path.isAbsolute(BUILD_DIR_PRO)
          ? BUILD_DIR_PRO
          : path.resolve(__dirname, BUILD_DIR_PRO);
      } else {
        r = path.resolve(
          __dirname,
          "../../../wordpress/www/wp-content/plugins/brizy-pro/public/editor-build"
        );
      }

      r = path.resolve(r, "./dev");
    } else {
      if (BUILD_DIR_PRO) {
        r = path.isAbsolute(BUILD_DIR_PRO)
          ? BUILD_DIR_PRO
          : path.resolve(__dirname, BUILD_DIR_PRO);
      } else {
        r = path.resolve(__dirname, "../build/pro");
      }
    }

    return r;
  }
};
