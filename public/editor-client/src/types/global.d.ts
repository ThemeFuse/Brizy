import { AutoSave } from "./AutoSave";
import { AddMediaData, AddMediaExtra } from "./Media";
import { OnChange } from "./OnChange";
import { PublishData } from "./Project";

declare class WPMediaLibrary {
  get: (selector: string) => import("backbone").Collection;
}

export interface PLUGIN_ENV {
  hash?: string;
  url?: string;
  editorVersion?: string;
  actions?: {
    getMediaUid?: string;
    getAttachmentUid?: string;
  };
  api?: {
    mediaResizeUrl?: string;
    customFileUrl?: string;
  };
  l10n?: Record<string, string>;
}

export interface VISUAL_CONFIG {
  //#region UI

  ui?: {
    //#region Publish

    publish?: {
      label?: string;
      handler: (
        res: Response<PublishData>,
        rej: Response<string>,
        extra: PublishData
      ) => void;
    };

    //#endregion
  };

  //#endregion

  //#region Events

  onAutoSave?: (data: AutoSave) => void;

  // Triggered when the user change the
  // pageData, globalBlocks or projectData
  onChange?: (data: OnChange) => void;

  //#endregion

  //#region API

  api?: {
    // Media
    media?: {
      mediaResizeUrl?: string;

      addMedia?: {
        label?: string;
        handler: (
          res: Response<AddMediaData>,
          rej: Response<string>,
          extra: AddMediaExtra
        ) => void;
      };

      addMediaGallery?: {
        label?: string;
        handler: (
          res: Response<Array<AddImageData>>,
          rej: Response<string>,
          extra: AddMediaExtra
        ) => void;
      };
    };
    // File
    customFile?: {
      customFileUrl?: string;

      addFile?: {
        label?: string;
        handler: (
          res: Response<AddFileData>,
          rej: Response<string>,
          extra: AddFileExtra
        ) => void;
      };
    };
  };

  //#endregion
}

declare global {
  interface WPMediaFrame {
    (config: {
      library: {
        type: string;
      };
      states: WPMediaLibrary;
    }): WPMediaFrame;
    on: (name: "select" | "close" | "escape", cb: () => void) => void;
    open: () => void;
    detach: () => void;
    controller: {
      Library: {
        new (config: {
          library: WPMediaLibrary;
          multiple: boolean;
          title: string;
          filterable: "uploaded" | "all";
          priority: number;
        }): WPMediaLibrary;
      };
    };
    query: (query: {
      type: "image, audio, video, application, text, pdf";
    }) => WPMediaLibrary;
    state: () => WPMediaLibrary;
  }

  namespace NodeJS {
    interface Global {
      "process.env.IS_PRODUCTION": boolean;
    }
  }

  interface Window {
    // Attach Builder events
    __VISUAL_CONFIG__?: VISUAL_CONFIG;

    // Internal Config
    __BRZ_PLUGIN_ENV__?: PLUGIN_ENV;

    // WP Media
    parent: Window;
    wp?: {
      media?: WPMediaFrame;
    };
  }
}
