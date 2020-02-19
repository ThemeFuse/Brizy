import "@babel/polyfill";
import jQuery from "jquery";
import initExports from "./initExports";
import initPopups from "./initPopups.js";

jQuery(document).ready(function() {
  const $page = jQuery(".brz-root__container");

  initExports($page);
  initPopups();
});
