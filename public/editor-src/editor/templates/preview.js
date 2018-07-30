<!-- inject:libs -->
<!-- endinject -->

jQuery(document).ready(function(jQuery) {
// i18n doesn't currently work at export
// so we'll mock it for now to not raise errors
var i18n = {
  t: function(key) {
    return "i18n mock. Requested " + key;
  }
};

<!-- inject:components -->
<!-- endinject -->

<!-- inject:editorComponents -->
<!-- endinject -->
});
