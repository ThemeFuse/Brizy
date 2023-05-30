import { AddFileData, AddFileExtra } from "./File";
import { AddImageData, AddMediaData, AddMediaExtra } from "./Media";

export interface VISUAL_CONFIG {
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
      fileUrl?: string;

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

export interface CLOUD_ENV {
  token?: string;
  editorVersion?: string;
  mediaResizeUrl?: string;
  fileUrl?: string;

  api?: {
    uploadMediaUrl?: string;
    uploadFileUrl?: string;
  };
}

declare global {
  namespace NodeJS {
    interface Global {
      "process.env.IS_PRODUCTION": boolean;
    }
  }

  interface Window {
    // Attach Builder events
    __VISUAL_CONFIG__?: VISUAL_CONFIG;

    // Internal Config
    __CLOUD_ENV__?: CLOUD_ENV;
  }
}
