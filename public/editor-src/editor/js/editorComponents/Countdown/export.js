import $ from "jquery";
import * as languages from "./languages";

export default function($node) {
  $node.find(".brz-countdown").each(function() {
    var $this = $(this);

    // timer
    var $daysNumber = $this.find(
      ".brz-countdown__days > .brz-countdown__number"
    );
    var $hoursNumber = $this.find(
      ".brz-countdown__hours > .brz-countdown__number"
    );
    var $minutesNumber = $this.find(
      ".brz-countdown__minutes > .brz-countdown__number"
    );
    var $secondsNumber = $this.find(
      ".brz-countdown__seconds > .brz-countdown__number"
    );

    var $daysLabel = $this.find(".brz-countdown__days > .brz-countdown__label");
    var $hoursLabel = $this.find(
      ".brz-countdown__hours > .brz-countdown__label"
    );
    var $minutesLabel = $this.find(
      ".brz-countdown__minutes > .brz-countdown__label"
    );
    var $secondsLabel = $this.find(
      ".brz-countdown__seconds > .brz-countdown__label"
    );

    var endTime = $this.attr("data-end");
    var timezone = $this.attr("data-timezone");
    var language = $this.attr("data-language");

    var leftPadWith0 = function(number) {
      return ("0" + number).slice(-2);
    };

    $this.countdown({
      now: Date.now(),
      endDate: endTime,
      timeZoneOffset: timezone * 60 * 1000,
      tickInterval: 1000,
      language: languages[language] || languages["en"],
      onTick: function(remaining) {
        $daysNumber.text(remaining.days.amount);
        $hoursNumber.text(leftPadWith0(remaining.hours.amount));
        $minutesNumber.text(leftPadWith0(remaining.minutes.amount));
        $secondsNumber.text(leftPadWith0(remaining.seconds.amount));

        $daysLabel.text(remaining.days.title);
        $hoursLabel.text(remaining.hours.title);
        $minutesLabel.text(remaining.minutes.title);
        $secondsLabel.text(remaining.seconds.title);
      }
    });
  });
}
