import Motion from "@brizy/motion";
import {
  Instance as PopperInstance,
  Options as PopperOptions
} from "@popperjs/core/lib/types";
import { FlatpickrFn } from "flatpickr/dist/types/instance";
import ImagesLoaded from "imagesloaded";
import Isotope from "isotope-layout";
import Lottie from "lottie-web";
import Scrollbars from "perfect-scrollbar";
import { Dropdown } from "visual/libs/dropdown";
import { initEkklesiaPopups } from "visual/libs/group-7";
import Gallery from "../libs/gallery";

export type GalleryIsotope = Isotope;
export type GalleryJustified = Gallery;
export type GalleryIsotopeType = typeof Isotope;
export type GalleryJustifiedType = typeof Gallery;

// Our own jquery plugins

declare class WPMediaLibrary {
  get: (selector: string) => import("backbone").Collection;
}

interface BrizyLibs {
  Flatpickr?: FlatpickrFn;
  Scrollbars?: typeof Scrollbars;
  Animation?: (s: string | Element, settings: IntersectionObserverInit) => void;
  // @ts-expect-error: Cannot use namespace 'Motion' as a type.
  Motions?: Motion;
  initEkklesiaPopups: typeof initEkklesiaPopups;
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
  Gallery?: typeof Gallery;
}

declare global {
  interface WPMediaFrame {
    (config: {
      library: {
        type: string;
      };
      states: WPMediaLibrary;
    }): WPMediaFrame;
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
  }

  namespace NodeJS {
    interface Global {
      IS_EDITOR: boolean;
      BRZ_IS_DRAGGING?: boolean;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Brizy: any;
      parent: Global;
      wp: {
        media: WPMediaFrame;
      };
    }
  }

  interface Window {
    BrizyLibs: BrizyLibs;
    BrizyProLibs?: BrizyProLibs;
    jQuery: JQuery;
    jquery: JQuery;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Brz: Record<string, any>;

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
    parallax(p: unknown, x?: boolean): void;
    backgroundVideo(b: unknown, c?: unknown): void;
    select2(s: {
      width?: string;
      minimumResultsForSearch: number;
      dropdownParent: JQuery;
      templateResult?: (item: Record<string, unknown>) => HTMLDivElement;
      templateSelection?: (item: Record<string, unknown>) => HTMLDivElement;
      dropdownAutoWidth?: boolean;
    }): void;
  }

  type Primitive = undefined | null | string | number | boolean;
}
