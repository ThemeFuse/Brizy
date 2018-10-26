const path = require("path");

exports.argvVars = argv => {
  const argv_ = require("minimist")(argv.slice(2));

  const TEMPLATE_NAME = "brizy";
  const TARGET = argv_.target || argv_.t || "none";
  const IS_PRODUCTION = Boolean(argv_.production);
  const IS_EXPORT = Boolean(argv_.export || argv_.e);
  const IS_PRO = Boolean(argv_.pro || argv_.p);
  const BUILD_DIR = argv_["build-dir"];
  const BUILD_DIR_PRO = argv_["build-dir-pro"];
  const NO_WATCH = Boolean(argv_["no-watch"]);
  const PORT = argv_.port || 3000;

  const paths = {
    editor: path.resolve(__dirname, "../editor"),
    template: path.resolve(__dirname, `../templates/${TEMPLATE_NAME}`),
    build: BUILD_DIR
      ? path.isAbsolute(BUILD_DIR)
        ? BUILD_DIR
        : path.resolve(__dirname, BUILD_DIR)
      : TARGET === "WP" && !IS_PRODUCTION
        ? path.resolve(
            __dirname,
            "../../../apache/wordpress/wp-content/plugins/brizy/public/editor-build"
          )
        : path.resolve(__dirname, `../build/${TEMPLATE_NAME}`),
    buildPro: BUILD_DIR_PRO
      ? path.isAbsolute(BUILD_DIR_PRO)
        ? BUILD_DIR_PRO
        : path.resolve(__dirname, BUILD_DIR_PRO)
      : TARGET === "WP" && !IS_PRODUCTION
        ? path.resolve(
            __dirname,
            "../../../apache/wordpress/wp-content/plugins/brizy-pro/public/editor-build"
          )
        : path.resolve(__dirname, `../build/${TEMPLATE_NAME}/pro`)
  };

  return {
    TEMPLATE_NAME,
    TARGET,
    IS_PRODUCTION,
    IS_EXPORT,
    IS_PRO,
    BUILD_DIR,
    BUILD_DIR_PRO,
    NO_WATCH,
    PORT,
    paths
  };
};
