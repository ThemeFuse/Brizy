import Motion from "@brizy/motion";
import { BrizyProducts } from "@brizy/widget/src/Shopify/Variant/types";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import {
  Instance as PopperInstance,
  Options as PopperOptions
} from "@popperjs/core/lib/types";
import { FlatpickrFn } from "flatpickr/dist/types/instance";
import ImagesLoaded from "imagesloaded";
import Isotope from "isotope-layout";
import Lottie from "lottie-web";
import Scrollbars from "perfect-scrollbar";
import { ReactElement } from "react";
import { Swiper } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import { Dropdown } from "visual/libs/dropdown";
import { initEkklesiaPopups } from "visual/libs/group-7";
import { Store } from "visual/redux/store";
import Chart from "../libs/Chart";
import Gallery from "../libs/gallery";

export type GalleryIsotope = Isotope;
export type GalleryJustified = Gallery;
export type GalleryIsotopeType = typeof Isotope;
export type GalleryJustifiedType = typeof Gallery;
export type SwiperType = Swiper;
export type SwiperInstanceType = typeof Swiper;
export type ChartInstanceType = typeof Chart;
export type ChartType = Chart;

// Our own jquery plugins

declare class WPMediaLibrary {
  get: (selector: string) => import("backbone").Collection;
}

declare module "react-dom" {
  export function renderToStaticMarkup(element: ReactElement): string;
  export function renderToString(element: ReactElement): string;
}

interface BrizyLibs {
  Flatpickr?: FlatpickrFn;
  Scrollbars?: typeof Scrollbars;
  Animation?: (s: string | Element, settings: IntersectionObserverInit) => void;
  // @ts-expect-error: Cannot use namespace 'Motion' as a type.
  Motions?: Motion;
  initEkklesiaPopups: typeof initEkklesiaPopups;
  Swiper: SwiperInstanceType;
  Autoplay: Autoplay;
  EffectFade: EffectFade;
}

interface BrizyProLibs {
  CreatePopper?: (
    i: Element,
    c: Element,
    options?: Partial<PopperOptions>
  ) => PopperInstance;
  Dropdown?: typeof Dropdown;
  ImagesLoaded?: typeof ImagesLoaded;
  Isotope?: typeof Isotope;
  MMenu?: unknown;
  Lottie?: typeof Lottie;
  DotLottie?: typeof DotLottie;
  Gallery?: typeof Gallery;
  Chart?: ChartInstanceType;
}

declare global {
  interface WPMediaFrame {
    on: (name: "select" | "close", cb: () => void) => void;
    open: () => void;
    detach: () => void;
    controller: {
      Library: {
        new (config: {
          library?: WPMediaLibrary;
          multiple: boolean;
          title: string;
          filterable: "uploaded";
          priority: number;
        }): WPMediaLibrary;
      };
    };
    query: (query: { type: "image" }) => WPMediaLibrary;
    state: () => WPMediaLibrary;

    (config: {
      library: {
        type: string;
      };
      states: WPMediaLibrary;
    }): WPMediaFrame;
  }

  namespace NodeJS {
    interface Global {
      BRZ_IS_DRAGGING?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Brizy: any;
      parent: Global;
      wp: {
        media: WPMediaFrame;
      };
      brzFormV2Captcha?: (token: string) => void;
      grecaptcha: {
        render: (
          node: HTMLElement,
          { sitekey: string, size: string, callback: VoidFunction }
        ) => string;
        execute: (id: string) => void;
        reset: (recaptchaId: string) => void;
      };
      brzOnloadRecaptchaCallback: VoidFunction;
    }
  }

  interface Window {
    BrizyLibs: BrizyLibs;
    BrizyProLibs?: BrizyProLibs;
    jQuery: JQuery;
    jquery: JQuery;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Brz: Record<string, any>;
    brizyProducts?: BrizyProducts;
    brzStore: Store;

    // Check this types on documentations of twitter
    // https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
    twttr?: {
      init: boolean;
      ready: VoidFunction;
      events: {
        bind: VoidFunction;
        unbind: VoidFunction;
        trigger: VoidFunction;
      };
    };
  }

  interface JQuery {
    brzParallax(p: unknown, x?: boolean): void;
    backgroundVideo(b: unknown, c?: unknown): void;
    select2(s: {
      width?: string;
      minimumResultsForSearch: number;
      dropdownParent: JQuery;
      placeholder?: string;
      templateResult?: (item: Record<string, unknown>) => HTMLDivElement;
      templateSelection?: (
        item: Record<string, unknown>
      ) => HTMLDivElement | string;
      dropdownAutoWidth?: boolean;
    }): void;
    popup(): {
      close?: () => void;
      open?: () => void;
    };
  }

  type Primitive = undefined | null | string | number | boolean;
}
