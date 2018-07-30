var Pages = require('visual/global/Pages');
var Router = require('visual/global/Router');

export default function() {
  var currentPageId = Router.getActivePageId();
  return Pages.getPageById(currentPageId);
};
