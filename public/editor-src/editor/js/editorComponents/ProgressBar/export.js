import $ from "jquery";

export default function($node) {
  $node.find(".brz-progress-bar").each(function() {
    const $this = $(this);
    const $percentWrapper = $this.find(".brz-progress-bar__wrapper");
    const $percentText = $this.find(".brz-progress-bar__percent");
    const type = $this.data().type;
    const percentValue = parseInt($percentWrapper.attr("data-progress"));

    $({ countNum: 0 }).animate(
      { countNum: percentValue },
      {
        duration: 1500,
        easing: "linear",

        step: function() {
          $percentText.text(Math.floor(this.countNum) + "%");
          $percentWrapper.css({
            maxWidth: Math.round(this.countNum + 0.5) + "%"
          });

          if (type === "style2") {
            $percentText.css({
              marginLeft:
                Math.round(this.countNum + 0.5) -
                `${percentValue >= 94 ? 7 : 1}` +
                "%"
            });
          }
        },

        complete: function() {
          $percentText.text(Math.round(this.countNum) + "%");
        }
      }
    );
  });
}
