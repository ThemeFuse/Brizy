import Config from "visual/global/Config";

// https://webpack.js.org/guides/public-path/#on-the-fly
__webpack_public_path__ = Config.get("urls").assets + "/editor/js/";
