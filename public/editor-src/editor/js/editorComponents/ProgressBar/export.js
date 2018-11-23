import $ from "jquery";

export default function() {
  $(".brz-progress-bar").each(function() {
    var $this = $(this);
    var percentWrapper = $this.find(".brz-progress-bar__wrapper");
    var percentText = $this.find(".brz-progress-bar__percent");
    var percentValue = parseInt(percentWrapper.attr("data-progress"));

    $({ countNum: 0 }).animate(
      { countNum: percentValue },
      {
        duration: 1500,
        easing: "linear",

        step: function() {
          percentText.text(Math.floor(this.countNum) + "%");
          percentWrapper.css({
            maxWidth: Math.round(this.countNum + 0.5) + "%"
          });
        },

        complete: function() {
          percentText.text(Math.round(this.countNum) + "%");
        }
      }
    );
  });
}
