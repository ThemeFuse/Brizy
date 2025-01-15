import {
  Settings as MotionSettings,
  Viewport as MotionViewport,
  MouseSettings,
  ScrollSettings
} from "@brizy/motion/es/types";
import { setIn } from "timm";
import { ElementModel } from "visual/component/Elements/Types";
import { FromElementModelGetter } from "visual/component/Options/Type";
import { createOptionId } from "visual/editorComponents/EditorComponent/utils";
import { isPro } from "visual/utils/env";
import Config from "visual/global/Config";
import { defaultValueValue } from "visual/utils/onChange/device";
import { fromElementModel } from "visual/utils/options/Motion/converters";
import { Value as MotionValue } from "visual/utils/options/Motion/types/Value";
import { Viewport } from "visual/utils/options/Motion/types/Viewport";
import { DESKTOP, MOBILE, TABLET } from "visual/utils/responsiveMode";
import { NORMAL } from "visual/utils/stateMode";
import { encodeToString } from "visual/utils/string";
import { MouseAttr, ScrollAttr, ScrollMotionAttr } from "./types";
import { Store } from "visual/redux/store";

const optionTypeScrollToAttr = (settings: ScrollSettings): ScrollAttr => {
  switch (settings.type) {
    case "blur": {
      return {
        "data-motion-scroll-blur": encodeToString({
          scrollStep: settings.scrollStep,
          direction: settings.direction,
          viewport: settings.viewport
        })
      };
    }
    case "horizontal": {
      return {
        "data-motion-scroll-horizontal": encodeToString({
          scrollStep: settings.scrollStep,
          direction: settings.direction,
          viewport: settings.viewport
        })
      };
    }
    case "rotate": {
      return {
        "data-motion-scroll-rotate": encodeToString({
          scrollStep: settings.scrollStep,
          direction: settings.direction,
          xPosition: settings.xPosition,
          yPosition: settings.yPosition,
          viewport: settings.viewport
        })
      };
    }
    case "scale": {
      return {
        "data-motion-scroll-scale": encodeToString({
          scrollStep: settings.scrollStep,
          direction: settings.direction,
          xPosition: settings.xPosition,
          yPosition: settings.yPosition,
          viewport: settings.viewport
        })
      };
    }
    case "transparency": {
      return {
        "data-motion-scroll-transparency": encodeToString({
          scrollStep: settings.scrollStep,
          direction: settings.direction,
          viewport: settings.viewport
        })
      };
    }
    case "vertical": {
      return {
        "data-motion-scroll-vertical": encodeToString({
          scrollStep: settings.scrollStep,
          direction: settings.direction,
          viewport: settings.viewport
        })
      };
    }
  }
};

const optionTypeMouseToAttr = (settings: MouseSettings): MouseAttr => {
  switch (settings.type) {
    case "track": {
      return {
        "data-motion-mouse-track": encodeToString({
          type: settings.type,
          direction: settings.direction,
          distance: settings.distance
        })
      };
    }
    case "3dfit": {
      return {
        "data-motion-mouse-fit": encodeToString({
          type: settings.type,
          direction: settings.direction,
          distance: settings.distance
        })
      };
    }
  }
};

const optionViewportToLib = (viewport: Viewport): MotionViewport => ({
  top: viewport.top * 100,
  bottom: viewport.bottom * 100
});

const createResponsiveOptions = (
  options: MotionValue
): MotionSettings | undefined => {
  const {
    vertical,
    horizontal,
    transparency,
    blur,
    rotate,
    scale,
    mouseTrack,
    mouseTilt
  } = options;

  const scrollOptions: ScrollSettings[] = [];
  const mouseOptions: MouseSettings[] = [];

  if (vertical) {
    scrollOptions.push({
      type: "vertical",
      direction: vertical.direction,
      scrollStep: vertical.speed * 10,
      viewport: optionViewportToLib(vertical.viewport)
    });
  }

  if (horizontal) {
    scrollOptions.push({
      type: "horizontal",
      direction: horizontal.direction,
      scrollStep: horizontal.speed * 10,
      viewport: optionViewportToLib(horizontal.viewport)
    });
  }

  if (transparency) {
    scrollOptions.push({
      type: "transparency",
      direction: transparency.direction,
      scrollStep: transparency.level * 10,
      viewport: optionViewportToLib(transparency.viewport)
    });
  }

  if (rotate) {
    scrollOptions.push({
      type: "rotate",
      direction: rotate.direction,
      xPosition: rotate.x,
      yPosition: rotate.y,
      scrollStep: rotate.speed * 10,
      viewport: optionViewportToLib(rotate.viewport)
    });
  }

  if (scale) {
    scrollOptions.push({
      type: "scale",
      direction: scale.direction,
      xPosition: scale.x,
      yPosition: scale.y,
      scrollStep: scale.speed,
      viewport: optionViewportToLib(scale.viewport)
    });
  }

  if (blur) {
    scrollOptions.push({
      type: "blur",
      direction: blur.direction,
      scrollStep: blur.level * 10,
      viewport: optionViewportToLib(blur.viewport)
    });
  }

  if (mouseTrack) {
    mouseOptions.push({
      type: "track",
      direction: mouseTrack.direction,
      distance: mouseTrack.speed * 10
    });
  }

  if (mouseTilt) {
    mouseOptions.push({
      type: "3dfit",
      direction: mouseTilt.direction,
      distance: mouseTilt.speed * 10
    });
  }

  let motionSettings: MotionSettings | undefined = undefined;

  if (scrollOptions.length) {
    motionSettings = {
      scroll: scrollOptions
    };
  }

  if (mouseOptions.length) {
    motionSettings = {
      ...motionSettings,
      mouse: mouseOptions
    };
  }

  return motionSettings;
};

export const makeOptionToAttr = (options: MotionSettings): ScrollMotionAttr => {
  const { scroll, mouse, responsive } = options;
  let attr: ScrollMotionAttr = {};

  if (Array.isArray(scroll)) {
    scroll.forEach((option) => {
      const attrOption = optionTypeScrollToAttr(option);
      attr = { ...attr, ...attrOption };
    });
  } else if (scroll) {
    attr = optionTypeScrollToAttr(scroll);
  }

  if (Array.isArray(mouse)) {
    mouse.forEach((option) => {
      const attrOption = optionTypeMouseToAttr(option);
      attr = { ...attr, ...attrOption };
    });
  } else if (mouse) {
    const attrOption = optionTypeMouseToAttr(mouse);
    attr = { ...attr, ...attrOption };
  }

  if (responsive?.length) {
    attr["data-motion-responsive"] = encodeToString(responsive);
  }

  return attr;
};

export const makeOptionValueToMotion = (data: {
  v: ElementModel;
  store: Store;
  prefix?: string;
}): MotionSettings | undefined => {
  const { v, prefix = "motion" } = data;
  let settings = undefined;

  if (isPro(Config.getAll())) {
    const getDesktop: FromElementModelGetter = (k) =>
      defaultValueValue({
        v,
        key: createOptionId(prefix, k),
        device: DESKTOP,
        state: NORMAL
      });
    const getTablet: FromElementModelGetter = (k) =>
      defaultValueValue({
        v,
        key: createOptionId(prefix, k),
        device: TABLET,
        state: NORMAL
      });
    const getMobile: FromElementModelGetter = (k) =>
      defaultValueValue({
        v,
        key: createOptionId(prefix, k),
        device: MOBILE,
        state: NORMAL
      });
    const desktopModel = fromElementModel(getDesktop);
    const tabletModel = fromElementModel(getTablet);
    const mobileModel = fromElementModel(getMobile);

    settings = createResponsiveOptions(desktopModel);
    const tablet = createResponsiveOptions(tabletModel);
    const mobile = createResponsiveOptions(mobileModel);

    if (settings || tablet || mobile) {
      const responsive: MotionSettings["responsive"] = [];
      const emptySettings = {
        scroll: undefined,
        mouse: undefined
      };

      if (tablet) {
        responsive.push({
          breakpoint: 991,
          settings: tablet
        });
      } else {
        responsive.push({
          breakpoint: 991,
          settings: emptySettings
        });
      }

      if (mobile) {
        responsive.push({
          breakpoint: 767,
          settings: mobile
        });
      } else {
        responsive.push({
          breakpoint: 767,
          settings: emptySettings
        });
      }

      settings = setIn(settings, ["responsive"], responsive) as MotionSettings;
    }
  }

  return settings;
};
