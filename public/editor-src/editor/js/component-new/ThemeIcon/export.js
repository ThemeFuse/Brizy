import $ from "jquery";
import { responseToSvg } from "./utils";

$(".brz-icon-svg").each(function() {
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
