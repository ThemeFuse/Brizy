import { getFreeLibs } from "visual/libs";
import { makeAttr } from "visual/utils/i18n/attribute";
import { formatDate, getTime } from "./utils";

// jQuery 3.7.1's `showHide`, minus its remembered display: nothing hides the box through jQuery.

const defaultDisplayMap = {};

const getStyles = (elem) => {
  const view = elem.ownerDocument.defaultView;

  return (view?.opener ? view : window).getComputedStyle(elem);
};

const cssDisplay = (elem) => {
  const display = getStyles(elem).getPropertyValue("display");

  return display === "" && !elem.isConnected ? elem.style.display : display;
};

const getDefaultDisplay = (elem) => {
  const doc = elem.ownerDocument;
  const nodeName = elem.nodeName;
  let display = defaultDisplayMap[nodeName];

  if (display) {
    return display;
  }

  const temp = doc.body.appendChild(doc.createElement(nodeName));
  display = cssDisplay(temp);

  temp.parentNode.removeChild(temp);

  if (display === "none") {
    display = "block";
  }
  defaultDisplayMap[nodeName] = display;

  return display;
};

const isHiddenWithinTree = (elem) =>
  elem.style.display === "none" ||
  (elem.style.display === "" &&
    elem.isConnected &&
    cssDisplay(elem) === "none");

const showElements = (elements) => {
  const values = [];

  elements.forEach((elem, index) => {
    if (elem.style.display === "none") {
      elem.style.display = "";
    }
    if (elem.style.display === "" && isHiddenWithinTree(elem)) {
      values[index] = getDefaultDisplay(elem);
    }
  });

  elements.forEach((elem, index) => {
    if (values[index] !== undefined) {
      elem.style.display = values[index];
    }
  });
};

const hideElement = (elem) => {
  if (elem.style.display !== "none") {
    elem.style.display = "none";
  }
};

const setText = (nodes, text) => {
  nodes.forEach((node) => {
    node.textContent = text;
  });
};

export default function (node) {
  const { countdown } = getFreeLibs();

  node.querySelectorAll(".brz-countdown2").forEach((element) => {
    // timer
    const daysNumber = element.querySelectorAll(
      ":scope .brz-countdown2__days > .brz-countdown2__number"
    );
    const hoursNumber = element.querySelectorAll(
      ":scope .brz-countdown2__hours > .brz-countdown2__number"
    );
    const minutesNumber = element.querySelectorAll(
      ":scope .brz-countdown2__minutes > .brz-countdown2__number"
    );
    const secondsNumber = element.querySelectorAll(
      ":scope .brz-countdown2__seconds > .brz-countdown2__number"
    );

    const message = element.querySelectorAll(".brz-countdown2-message");

    const date = element.getAttribute(makeAttr("end")) ?? undefined;
    const hours = element.getAttribute(makeAttr("hours")) ?? undefined;
    const minutes = element.getAttribute(makeAttr("minutes")) ?? undefined;

    const newDate = date.split("/");
    const convertedDate = `${newDate[1]}/${newDate[0]}/${newDate[2]}`;

    const endTime = getTime(formatDate(convertedDate, "m/d/Y"), hours, minutes);

    const timezone = element.getAttribute(makeAttr("timezone")) ?? undefined;
    const linkAction = element.getAttribute(makeAttr("link-type")) ?? undefined;
    const redirect = element.getAttribute(makeAttr("redirect")) ?? undefined;
    const actions = element.getAttribute(makeAttr("action")) ?? undefined;
    const leftPadWith0 = (number) =>
      number >= 0 && number <= 9 ? `0${number}` : number;

    countdown(element, {
      now: Date.now(),
      endDate: endTime,
      timeZoneOffset: timezone * 60 * 1000,
      tickInterval: 1000,
      onTick: (remaining) => {
        setText(daysNumber, leftPadWith0(remaining.days));
        setText(hoursNumber, leftPadWith0(remaining.hours));
        setText(minutesNumber, leftPadWith0(remaining.minutes));
        setText(secondsNumber, leftPadWith0(remaining.seconds));

        if (Object.values(remaining).every((value) => value === 0)) {
          if (linkAction === "redirect") {
            window.location.href = redirect;
          } else if (actions === "showMessage") {
            showElements(message);
          } else if (linkAction === "linkAction" && actions === "none") {
            element.removeAttribute(makeAttr("message"));
            element.removeAttribute(makeAttr("redirect"));
            element.removeAttribute(makeAttr("hide"));
          } else if (linkAction === "linkAction" && actions === "hide") {
            hideElement(element);
          }
        }
      }
    });
  });
}
