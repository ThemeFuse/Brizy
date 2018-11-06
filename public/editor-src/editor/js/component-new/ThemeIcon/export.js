import $ from "jquery";
import Brizy from "Brizy";
import { responseToSvg } from "./utils";

Brizy.utils.correctIcons = function(node) {
  $(".brz-icon-svg", node).each(function() {
    var $this = $(this);
    var href = $this.data().href;

    if (href) {
      $.ajax({
        method: "GET",
        url: href,
        dataType: "text"
      })
        .done(function(res) {
          $this.html(responseToSvg(res));
        })
        .fail(function(jqXHR, textStatus) {
          console.warn("Request failed: " + textStatus);
        });
    }
  });
};

Brizy.utils.correctIcons(document.body);
