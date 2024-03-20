import { Action } from "./AiText";
import { AutoSave } from "./AutoSave";
import { ChoicesSync } from "./Choices";
import { CollectionExtra, CollectionType } from "./Collections";
import {
  BlocksArray,
  DefaultBlock,
  DefaultBlockWithID,
  DefaultTemplate,
  DefaultTemplateKits,
  DefaultTemplatePopup,
  KitItem,
  KitsWithThumbs,
  LayoutsWithThumbs,
  PopupsWithThumbs,
  StoriesWithThumbs
} from "./DefaultTemplate";
import { DCHandler } from "./DynamicContent";
import { AddFileData } from "./File";
import { AddMediaData, AddMediaGallery } from "./Media";
import { OnChange } from "./OnChange";
import { PopupConditions } from "./PopupConditions";
import { Posts } from "./Posts";
import { Data } from "./Publish";
import { SavedBlocks, SavedLayouts, SavedPopups } from "./SavedBlocks";
import { Screenshots } from "./Screenshots";

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
    fileUrl?: string;
  };
  l10n?: Record<string, string>;
  collectionTypes?: CollectionType[];
}

export interface VISUAL_CONFIG {
  //#region UI

  ui?: {
    //#region Publish

    publish?: {
      label?: string;
      handler: (
        res: Response<Data>,
        rej: Response<string>,
        extra: Data
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
    //AI
    textAI?: {
      handler?: (
        res: Response<string>,
        rej: Response<string>,
        data: { prompt: string; action?: Action }
      ) => void;
    };

    // Media
    media?: {
      mediaResizeUrl?: string;

      addMedia?: AddMediaData;

      addMediaGallery?: AddMediaGallery;
    };

    // File
    customFile?: {
      fileUrl?: string;

      addFile?: AddFileData;
    };

    // SavedBlocks
    savedBlocks?: SavedBlocks;

    // SavedLayouts
    savedLayouts?: SavedLayouts;

    // SavedPopups
    savedPopups?: SavedPopups;

    // PopupConditions
    popupConditions?: PopupConditions;

    // Screenshots
    screenshots?: Screenshots;

    defaultKits?: DefaultTemplateKits<
      KitsWithThumbs,
      DefaultBlock,
      Array<KitItem>
    >;
    defaultPopups?: DefaultTemplatePopup<PopupsWithThumbs, DefaultBlockWithID>;
    defaultLayouts?: DefaultTemplate<
      LayoutsWithThumbs,
      BlocksArray<DefaultBlockWithID>
    >;
    defaultStories?: DefaultTemplate<
      StoriesWithThumbs,
      BlocksArray<DefaultBlock> | DefaultBlock
    >;

    //Collection Items
    collectionItems?: {
      searchCollectionItems: {
        handler: (
          res: Response<Post[]>,
          rej: Response<string>,
          extra: CollectionExtra
        ) => void;
      };
      getCollectionItemsIds: {
        handler: (
          res: Response<ChoicesSync>,
          rej: Response<string>,
          extra: { id: string }
        ) => void;
      };
    };

    //Collection Types
    collectionTypes?: {
      loadCollectionTypes: {
        handler: (res: Response<ChoicesSync>, rej: Response<string>) => void;
      };
    };
  };

  //#endregion

  //#region Elements

  elements?: {
    posts: Posts;
  };

  //#endregion

  //#region Dynamic Content
  dynamicContent?: {
    handler?: DCHandler;
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
      type: "image, audio, video, application, text, pdf" | "image";
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
