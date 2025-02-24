import { Block } from "visual/types/Block";
import { read as readStr } from "visual/utils/reader/string";
import { decodeFromString } from "visual/utils/string";
import { modelTraverse } from "visual/utils/traverse";
import { getComponentDefaultValue } from "./common";

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
      const defaultLink = getComponentDefaultValue(type)?.link || {};
      const linkType = value.linkType || defaultLink.linkType;
      const linkUpload = readStr(value.linkUpload || defaultLink.linkUpload);

      if (linkType === "upload" && linkUpload) {
        files.add(linkUpload);
      }
    },
    RichText({ type, value }: Block) {
      const defaultValue = getComponentDefaultValue(type)?.content || {};
      const hrefRgx = /href="(.+?)"/g;
      const text = readStr(value.text || defaultValue.text);
      let hrefs;

      if (!text) {
        return;
      }

      while ((hrefs = hrefRgx.exec(text))) {
        try {
          const [, href] = hrefs; // eslint-disable-line @typescript-eslint/no-unused-vars
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
      const defaultContent = getComponentDefaultValue(type)?.content || {};
      const defaultLink = getComponentDefaultValue(type)?.link || {};
      const animationFile = readStr(
        value.animationFile || defaultContent.animationFile
      );
      const linkType = value.linkType || defaultLink.linkType;
      const linkUpload = readStr(value.linkUpload || defaultLink.linkUpload);

      if (linkType === "upload" && linkUpload) {
        files.add(linkUpload);
      }
      if (animationFile) {
        files.add(animationFile);
      }
    },
    Video({ type, value }: Block) {
      const defaultContent = getComponentDefaultValue(type)?.content || {};
      const fileName = readStr(value.custom || defaultContent.custom);
      const videoType = value.type || defaultContent.type;

      if (videoType === "custom" && fileName) {
        files.add(fileName);
      }
    },
    Audio({ type, value }: Block) {
      const defaultContent = getComponentDefaultValue(type)?.content || {};
      const audioName = readStr(value.audio || defaultContent.audio);

      if (audioName) {
        files.add(audioName);
      }
    },
    GlobalBlock({ value: { _id } }: Block) {
      if (_id && globalBlocks?.[_id]) {
        getUsedModelsUpload({ models: globalBlocks[_id] }).forEach((file) => {
          files.add(file);
        });
      }
    }
  });

  return [...files];
};
