import Motion from "@brizy/motion";
import { BrizyProducts } from "@brizy/widget/src/Shopify/Variant/types";
import { DotLottie } from "@lottiefiles/dotlottie-web";
import {
  Instance as PopperInstance,
  Options as PopperOptions
} from "@popperjs/core/lib/types";
import { FlatpickrFn } from "flatpickr/dist/types/instance";
import Formula from "fparser";
import ImagesLoaded from "imagesloaded";
import Isotope from "isotope-layout";
import Lottie from "lottie-web";
import Scrollbars from "perfect-scrollbar";
import { ReactElement } from "react";
import SlimSelect from "slim-select";
import { Swiper } from "swiper";
import { Autoplay, EffectFade } from "swiper/modules";
import { Dropdown } from "visual/libs/dropdown";
import { initEkklesiaPopups } from "visual/libs/group-7";
import { sticky } from "visual/libs/sticky";
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
  Formula?: typeof Formula;
  SlimSelect?: typeof SlimSelect;
  sticky?: typeof sticky;
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
      // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
      Brizy: any;
      parent: Global;
      wp: {
        media: WPMediaFrame;
      };
      brzFormV2Captcha?: (token: string) => void;
      grecaptcha: {
        render: (
          node: HTMLElement,
          // `callback` may be a function or the name of a global one; Form2's
          // export reads it straight out of `data-callback`, so it is a string
          options: {
            sitekey: string;
            size: string;
            callback?: string | VoidFunction;
          }
        ) => string;
        execute: (id: string) => void;
        reset: (recaptchaId: string) => void;
      };
      brzOnloadRecaptchaCallback: VoidFunction;
    }
  }

  namespace GoogleTag {
    type ConsentState = "granted" | "denied";

    type ConsentArg = "default" | "update";

    interface ConsentParams {
      ad_storage?: ConsentState;
      ad_user_data?: ConsentState;
      ad_personalization?: ConsentState;
      analytics_storage?: ConsentState;
      functionality_storage?: ConsentState;
      personalization_storage?: ConsentState;
      security_storage?: ConsentState;
      wait_for_update?: number;
      region?: string[];
    }

    type CustomParams = Record<string, unknown>;

    interface Commands {
      js: [config: Date];
      config: [targetId: string, config?: CustomParams];
      set:
        | [targetId: string, config: CustomParams | boolean | string]
        | [config: CustomParams];
      event: [eventName: string, eventParams?: CustomParams];
      get: [
        targetId: string,
        fieldName: string,
        callback?: (field: string | CustomParams | undefined) => void
      ];
      consent: [consentArg: ConsentArg, consentParams: ConsentParams];
    }

    type Gtag = <Command extends keyof Commands>(
      command: Command,
      ...args: Commands[Command]
    ) => void;

    type DataLayerItem = IArguments | Record<string, unknown> | VoidFunction;
  }

  interface Window {
    BrizyLibs: BrizyLibs;
    BrizyProLibs?: BrizyProLibs;
    jQuery: JQuery;
    jquery: JQuery;
    // biome-ignore lint/suspicious/noExplicitAny: migrated from eslint
    Brz: Record<string, any>;
    brizyProducts?: BrizyProducts;
    brzStore?: Store;

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
    google?: {
      search?: {
        cse?: {
          element?: {
            getElement: (gname: string) => {
              execute: (query: string) => void;
            };
          };
        };
      };
    };

    gtag?: GoogleTag.Gtag;
    dataLayer?: GoogleTag.DataLayerItem[];
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
    slick(data: unknown): JQuery;
  }

  type Primitive = undefined | null | string | number | boolean;
}
