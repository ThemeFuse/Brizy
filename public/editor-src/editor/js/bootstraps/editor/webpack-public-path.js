import Config from "visual/global/Config";

/* eslint-disable no-undef */
// https://webpack.js.org/guides/public-path/#on-the-fly
__webpack_public_path__ = Config.get("urls").assets + "/editor/js/";
/* eslint-enabled no-undef */
