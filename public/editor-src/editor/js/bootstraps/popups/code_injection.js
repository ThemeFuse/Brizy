(function(window, document, script) {
  script = document.getElementById("brz-external-popup");
  if (!script) {
    script = document.createElement("script");
    script.async = 1;
    script.id = "brz-external-popup";
    script.src = "{{ popup_js_src }}";
    script.onload = init;
    document.body.appendChild(script);

    return;
  } else {
    init();
  }

  function init(currentLoadFn, pagePopupSrc) {
    pagePopupSrc = "{{ popup_page_src }}";

    if (window.brzExternalPopup) {
      window.brzExternalPopup(pagePopupSrc);
      return;
    }

    currentLoadFn = script.onload;
    script.onload = function() {
      currentLoadFn();

      window.brzExternalPopup(pagePopupSrc);
    };
  }
})(window, document);
