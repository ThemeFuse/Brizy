import ImagesLoaded from "imagesloaded";
import Isotope from "isotope-layout";
import Scrollbars from "perfect-scrollbar";
import Lottie from "lottie-web";
import {
  Options as PopperOptions,
  Instance as PopperInstance
} from "@popperjs/core/lib/types";
import { FlatpickrFn } from "flatpickr/dist/types/instance";
import { Dropdown } from "../libs/dropdown";

// Our own jquery plugins

declare class WPMediaLibrary {
  get: (selector: string) => import("backbone").Collection;
}

interface BrizyLibs {
  Flatpickr?: FlatpickrFn;
  Scrollbars?: typeof Scrollbars;
  Animation?: (s: string | Element, settings: IntersectionObserverInit) => void;
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
          library: WPMediaLibrary;
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
  }

  interface JQuery {
    parallax(p: unknown): void;
    backgroundVideo(b: unknown, c?: unknown): void;
  }
}
