import {
  Settings as MotionSettings,
  Mouse3DFit,
  MouseSettings,
  MouseTrack,
  ScrollBlur,
  ScrollHorizontal,
  ScrollRotate,
  ScrollScale,
  ScrollSettings,
  ScrollTransparency,
  ScrollVertical
} from "@brizy/motion/es/types";
import { getFreeLibs, getProLibs } from "visual/libs";
import { decodeFromString } from "visual/utils/string";

interface MotionData {
  scrollVertical?: ScrollVertical;
  scrollHorizontal?: ScrollHorizontal;
  scrollTransparency?: ScrollTransparency;
  scrollRotate?: ScrollRotate;
  scrollScale?: ScrollScale;
  scrollBlur?: ScrollBlur;
  mouseTrack?: MouseTrack;
  mouseFit?: Mouse3DFit;
}

const getMotionOptions = (data: MotionData): MotionSettings => {
  const {
    scrollVertical,
    scrollHorizontal,
    scrollTransparency,
    scrollRotate,
    scrollScale,
    scrollBlur,
    mouseTrack,
    mouseFit
  } = data;
  const scroll: ScrollSettings[] = [];
  const mouse: MouseSettings[] = [];

  if (scrollVertical) {
    const { scrollStep, direction, viewport } = scrollVertical;

    scroll.push({
      type: "vertical",
      scrollStep: Number(scrollStep ?? 1),
      direction,
      viewport
    });
  }

  if (scrollHorizontal) {
    const { scrollStep, direction, viewport } = scrollHorizontal;

    scroll.push({
      type: "horizontal",
      scrollStep: Number(scrollStep ?? 1),
      direction,
      viewport
    });
  }

  if (scrollTransparency) {
    const { scrollStep, direction, viewport } = scrollTransparency;

    scroll.push({
      type: "transparency",
      scrollStep: Number(scrollStep ?? 1),
      direction,
      viewport
    });
  }

  if (scrollRotate) {
    const {
      scrollStep,
      direction,
      viewport,
      xPosition = "center",
      yPosition = "center"
    } = scrollRotate;

    scroll.push({
      type: "rotate",
      scrollStep: Number(scrollStep ?? 1),
      viewport,
      direction,
      xPosition,
      yPosition
    });
  }

  if (scrollScale) {
    const {
      scrollStep,
      direction,
      viewport,
      xPosition = "center",
      yPosition = "center"
    } = scrollScale;

    scroll.push({
      type: "scale",
      scrollStep: Number(scrollStep ?? 1),
      direction,
      xPosition,
      yPosition,
      viewport
    });
  }

  if (scrollBlur) {
    const { scrollStep, direction, viewport } = scrollBlur;

    scroll.push({
      type: "blur",
      scrollStep: Number(scrollStep ?? 1),
      direction,
      viewport
    });
  }

  if (mouseTrack) {
    const { type, distance, direction } = mouseTrack;

    mouse.push({ type, direction, distance });
  }

  if (mouseFit) {
    const { type, distance, direction } = mouseFit;

    mouse.push({ type, direction, distance });
  }

  return { mouse, scroll };
};

const parseDecodeData = <T>(data?: string): T | undefined => {
  if (data) {
    return decodeFromString<T>(data);
  }
};

export default function ($node: JQuery): void {
  const { Motions } = getFreeLibs();
  const { ImagesLoaded } = getProLibs();

  const root = $node.get(0);
  if (!Motions || !root) {
    return;
  }

  root.querySelectorAll<HTMLElement>(".brz-motion--effects").forEach((node) => {
    const {
      motionScrollVertical,
      motionScrollHorizontal,
      motionScrollTransparency,
      motionScrollRotate,
      motionScrollScale,
      motionScrollBlur,
      motionMouseTrack,
      motionMouseFit,
      motionResponsive
    } = node.dataset;

    const { scroll, mouse } = getMotionOptions({
      scrollVertical: parseDecodeData<ScrollVertical>(motionScrollVertical),
      scrollHorizontal: parseDecodeData<ScrollHorizontal>(
        motionScrollHorizontal
      ),
      scrollTransparency: parseDecodeData<ScrollTransparency>(
        motionScrollTransparency
      ),
      scrollRotate: parseDecodeData<ScrollRotate>(motionScrollRotate),
      scrollScale: parseDecodeData<ScrollScale>(motionScrollScale),
      scrollBlur: parseDecodeData<ScrollBlur>(motionScrollBlur),
      mouseTrack: parseDecodeData<MouseTrack>(motionMouseTrack),
      mouseFit: parseDecodeData<Mouse3DFit>(motionMouseFit)
    });

    const config = {
      scroll,
      mouse,
      responsive:
        parseDecodeData<MotionSettings["responsive"]>(motionResponsive)
    };

    if (ImagesLoaded) {
      ImagesLoaded(node, () => {
        const instance = new Motions(node, config);

        window.Brz.on("elements.gallery.changed", (gallery: HTMLElement) => {
          if (node.contains(gallery)) {
            instance.arrange();
          }
        });
      });
    } else {
      const instance = new Motions(node, config);

      window.Brz.on("elements.gallery.changed", (gallery: HTMLElement) => {
        if (node.contains(gallery)) {
          instance.arrange();
        }
      });
    }
  });
}
