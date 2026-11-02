import { getFreeLibs } from "visual/libs";
import { makeAttr } from "visual/utils/i18n/attribute";
import { observe } from "./observer";
import { animate } from "./utils.export";

export default function (node: HTMLElement): void {
  const isStory = node.querySelectorAll<HTMLElement>(".brz-story").length > 0;

  if (isStory) {
    const { onSlider } = getFreeLibs();
    const countCurrentSlide = ({
      slides,
      currentSlide
    }: {
      slides: HTMLElement[];
      currentSlide: number;
    }) => {
      const current = slides[currentSlide];
      const counters = current?.querySelectorAll<HTMLElement>(".brz-counter");

      if (counters?.length) {
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
    };

    node.querySelectorAll(".brz-slick-slider").forEach((slider) => {
      onSlider(slider, "afterChange", countCurrentSlide);
      onSlider(slider, "init", countCurrentSlide);
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
