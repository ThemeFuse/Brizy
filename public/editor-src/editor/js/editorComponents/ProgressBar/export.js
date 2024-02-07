import $ from "jquery";

export default function ($node) {
  $node.find(".brz-progress-bar").each(function () {
    const $this = $(this);
    const $percentWrapper = $this.find(".brz-progress-bar__wrapper");
    const $percentText = $this.find(".brz-progress-bar__percent");
    const type = $this.data().brzType;
    const percentValue = parseInt($percentWrapper.attr("data-progress"));

    $({ countNum: 0 }).animate(
      { countNum: percentValue },
      {
        duration: 1500,
        easing: "linear",

        step: function () {
          $percentText.text(Math.floor(Math.min(this.countNum, 100)) + "%");
          $percentWrapper.css({
            maxWidth: Math.round(this.countNum + 0.5) + "%"
          });

          if (type === "style2") {
            $percentText.css({
              marginLeft: `clamp(0%, ${
                Math.round(this.countNum + 0.5) + "%"
              }, 100%)`,
              transform: `translateX(${Math.max(-this.countNum, -100) + "%"})`
            });
          }
        },

        complete: function () {
          $percentText.text(Math.round(Math.min(this.countNum, 100)) + "%");
          $percentWrapper.css({
            maxWidth: Math.round(this.countNum) + "%"
          });
        }
      }
    );
  });
}
