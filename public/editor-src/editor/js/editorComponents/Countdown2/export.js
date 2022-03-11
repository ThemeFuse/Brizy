import $ from "jquery";
import { getTime, formatDate } from "./utils";

export default function($node) {
  $node.find(".brz-countdown2").each(function() {
    var $this = $(this);

    // timer
    var $daysNumber = $this.find(
      ".brz-countdown2__days > .brz-countdown2__number"
    );
    var $hoursNumber = $this.find(
      ".brz-countdown2__hours > .brz-countdown2__number"
    );
    var $minutesNumber = $this.find(
      ".brz-countdown2__minutes > .brz-countdown2__number"
    );
    var $secondsNumber = $this.find(
      ".brz-countdown2__seconds > .brz-countdown2__number"
    );

    var $message = $this.find(".brz-countdown2-message");

    const date = $this.attr("data-end");
    const hours = $this.attr("data-hours");
    const minutes = $this.attr("data-minutes");

    const newDate = date.split("/");
    const convertedDate = `${newDate[1]}/${newDate[0]}/${newDate[2]}`;

    const endTime = getTime(formatDate(convertedDate, "m/d/Y"), hours, minutes);

    var timezone = $this.attr("data-timezone");
    var linkAction = $this.attr("data-link-type");
    var redirect = $this.attr("data-redirect");
    var actions = $this.attr("data-action");
    var leftPadWith0 = function(number) {
      return number >= 0 && number <= 9 ? "0" + number : number;
    };

    $this.countdown2({
      now: Date.now(),
      endDate: endTime,
      timeZoneOffset: timezone * 60 * 1000,
      tickInterval: 1000,
      onTick: function(remaining) {
        $daysNumber.text(leftPadWith0(remaining.days));
        $hoursNumber.text(leftPadWith0(remaining.hours));
        $minutesNumber.text(leftPadWith0(remaining.minutes));
        $secondsNumber.text(leftPadWith0(remaining.seconds));

        if (Object.values(remaining).every(value => value === 0)) {
          if (linkAction === "redirect") {
            window.location.href = redirect;
          } else if (actions === "showMessage") {
            $message.show();
          } else if (linkAction === "linkAction" && actions === "none") {
            $this
              .removeAttr("data-message")
              .removeAttr("data-redirect")
              .removeAttr("data-hide");
          } else if (linkAction === "linkAction" && actions === "hide") {
            $this.hide();
          }
        }
      }
    });
  });
}
