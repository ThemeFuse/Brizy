import { modelTraverse } from "visual/utils/traverse";
import { getComponentDefaultValue } from "./common";
import { Block } from "visual/types";
import { decodeFromString } from "visual/utils/string";

type UsedModelsFile = {
  models: Block | { items: Block[] };
  globalBlocks?: { [key: string]: Block };
};

export const getUsedModelsUpload = ({
  models,
  globalBlocks
}: UsedModelsFile): Array<string> => {
  const files: Set<string> = new Set();

  modelTraverse(models, {
    Component({ type, value }: Block) {
      const defaultLink = getComponentDefaultValue(type).link || {};
      const linkType = value.linkType || defaultLink.linkType;
      const linkUpload = value.linkUpload || defaultLink.linkUpload;

      if (linkType === "upload" && linkUpload) {
        files.add(linkUpload);
      }
    },
    RichText({ type, value }: Block) {
      const defaultValue = getComponentDefaultValue(type).content || {};
      const hrefRgx = /href="(.+?)"/g;
      const text = value.text || defaultValue.text;
      let hrefs;

      while ((hrefs = hrefRgx.exec(text))) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, href] = hrefs;
          const { type, upload } = decodeFromString<{
            type: string;
            upload: string;
          }>(href);

          if (type === "upload" && upload) {
            files.add(upload);
          }
        } catch (e) {
          if (process.env.NODE_ENV === "development") {
            console.log(e);
          }
        }
      }
    },
    Lottie({ type, value }: Block) {
      const defaultContent = getComponentDefaultValue(type).content || {};
      const defaultLink = getComponentDefaultValue(type).link || {};
      const animationFile = value.animationFile || defaultContent.animationFile;
      const linkType = value.linkType || defaultLink.linkType;
      const linkUpload = value.linkUpload || defaultLink.linkUpload;

      if (linkType === "upload" && linkUpload) {
        files.add(linkUpload);
      }
      if (animationFile) {
        files.add(animationFile);
      }
    },
    Video({ type, value }: Block) {
      const defaultContent = getComponentDefaultValue(type).content || {};
      const fileName = value.custom || defaultContent.custom;
      const videoType = value.type || defaultContent.type;

      if (videoType === "custom" && fileName) {
        files.add(fileName);
      }
    },
    Audio({ type, value }: Block) {
      const defaultContent = getComponentDefaultValue(type).content || {};
      const audioName = value.audio || defaultContent.audio;

      if (audioName) {
        files.add(audioName);
      }
    },
    GlobalBlock({ value: { _id } }: Block) {
      const globalBlockValue = globalBlocks && globalBlocks[_id];

      if (globalBlockValue) {
        getUsedModelsUpload({ models: globalBlockValue }).forEach(file => {
          files.add(file);
        });
      }
    }
  });

  return [...files];
};
