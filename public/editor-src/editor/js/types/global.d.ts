// Our own jquery plugins
interface JQuery {
  parallax(p: unknown): void;
  backgroundVideo(b: unknown, c?: unknown): void;
}

declare class WPMediaLibrary {
  get: (selector: string) => import("backbone").Collection;
}

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

declare namespace NodeJS {
  interface Global {
    IS_EDITOR: boolean;
    wp: {
      media: WPMediaFrame;
    };
  }
}
