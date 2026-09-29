import { getFreeLibs } from "visual/libs";
import { makeAttr } from "visual/utils/i18n/attribute";
import { languages } from "./languages";

const setText = (nodes, text) => {
  nodes.forEach((node) => {
    node.textContent = text;
  });
};

export default function (node) {
  const { countdown } = getFreeLibs();

  node.querySelectorAll(".brz-countdown").forEach((element) => {
    // timer
    const daysNumber = element.querySelectorAll(
      ":scope .brz-countdown__days > .brz-countdown__number"
    );
    const hoursNumber = element.querySelectorAll(
      ":scope .brz-countdown__hours > .brz-countdown__number"
    );
    const minutesNumber = element.querySelectorAll(
      ":scope .brz-countdown__minutes > .brz-countdown__number"
    );
    const secondsNumber = element.querySelectorAll(
      ":scope .brz-countdown__seconds > .brz-countdown__number"
    );

    const daysLabel = element.querySelectorAll(
      ":scope .brz-countdown__days > .brz-countdown__label"
    );
    const hoursLabel = element.querySelectorAll(
      ":scope .brz-countdown__hours > .brz-countdown__label"
    );
    const minutesLabel = element.querySelectorAll(
      ":scope .brz-countdown__minutes > .brz-countdown__label"
    );
    const secondsLabel = element.querySelectorAll(
      ":scope .brz-countdown__seconds > .brz-countdown__label"
    );

    const endTime = element.getAttribute(makeAttr("end")) ?? undefined;
    const timezone = element.getAttribute(makeAttr("timezone")) ?? undefined;
    const language = element.getAttribute(makeAttr("language")) ?? undefined;
    const currentLanguage = languages[language] || languages.en;

    const leftPadWith0 = (number) => `0${number}`.slice(-2);

    countdown(element, {
      now: Date.now(),
      endDate: Number(endTime),
      timeZoneOffset: timezone * 60 * 1000,
      tickInterval: 1000,
      onTick: ({ days, hours, minutes, seconds }) => {
        const daysTitle = currentLanguage.whichLabels(days)[3];
        const hoursTitle = currentLanguage.whichLabels(hours)[4];
        const minutesTitle = currentLanguage.whichLabels(minutes)[5];
        const secondsTitle = currentLanguage.whichLabels(seconds)[6];

        setText(daysNumber, days);
        setText(hoursNumber, leftPadWith0(hours));
        setText(minutesNumber, leftPadWith0(minutes));
        setText(secondsNumber, leftPadWith0(seconds));

        setText(daysLabel, daysTitle);
        setText(hoursLabel, hoursTitle);
        setText(minutesLabel, minutesTitle);
        setText(secondsLabel, secondsTitle);
      }
    });
  });
}
