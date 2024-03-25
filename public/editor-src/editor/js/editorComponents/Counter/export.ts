import { makeAttr } from "visual/utils/i18n/attribute";
import { observe } from "./observer";
import { animate } from "./utils.export";

export default function ($node: JQuery): void {
  const node = $node.get(0);

  if (!node) {
    return;
  }

  const isStory = node.querySelectorAll<HTMLElement>(".brz-story").length > 0;

  if (isStory) {
    const $slider = $node.find(".brz-slick-slider");

    $slider.on("afterChange init", (_, slick) => {
      const { currentSlide, $slides } = slick;

      const $currentSlide = $slides[currentSlide];
      const counters = $currentSlide.querySelectorAll(".brz-counter");

      if (counters.length) {
        counters.forEach((item: HTMLElement) => {
          animate({
            elem: item,
            start: Number(item.getAttribute(makeAttr("start")) ?? 0),
            end: Number(item.getAttribute(makeAttr("end")) ?? 100),
            duration: Number(item.getAttribute(makeAttr("duration")) ?? 2),
            separator: item.getAttribute(makeAttr("separator")) ?? ""
          });
        });
      }
    });
  } else {
    node.querySelectorAll<HTMLElement>(".brz-counter").forEach((element) => {
      observe({
        elem: element,
        start: Number(element.getAttribute(makeAttr("start")) ?? 0),
        end: Number(element.getAttribute(makeAttr("end")) ?? 100),
        duration: Number(element.getAttribute(makeAttr("duration")) ?? 2),
        separator: element.getAttribute(makeAttr("separator")) ?? "",
        wasAnimated: false
      });
    });
  }
}
