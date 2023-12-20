import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { GlobalBlock, PageCommon, Project } from "visual/types";
import { t } from "visual/utils/i18n";
import { compileBlock, compilePage } from "../worker";

interface CompilePage {
  type: "page";
  compile: Awaited<ReturnType<typeof compilePage>>;
}

interface CompileGlobalBlock {
  type: "globalBlock";
  uid: string;
  compile: Awaited<ReturnType<typeof compileBlock>>;
}

interface PageType {
  type: "page";
  project: Project;
  page: PageCommon;
  config: ConfigCommon;
}

interface GlobalBlockType {
  type: "globalBlock";
  project: Project;
  block: GlobalBlock;
  config: ConfigCommon;
}

type EntryType = PageType | GlobalBlockType;

interface OutputTypes {
  page: CompilePage;
  globalBlock: CompileGlobalBlock;
}

export const getHTML = <E extends EntryType, T extends E["type"]>(
  data: E
): Promise<OutputTypes[T]> => {
  return new Promise((res, rej) => {
    const type = data.type;

    switch (type) {
      case "page": {
        (async () => {
          try {
            const compiled = await compilePage(data);
            const page = {
              type: "page",
              compile: compiled
            } as OutputTypes[T];

            res(page);
          } catch (e) {
            rej(t("Fail to compile page"));
          }
        })();
        break;
      }
      case "globalBlock": {
        (async () => {
          try {
            const compiled = await compileBlock({
              project: data.project,
              block: data.block.data,
              config: data.config
            });
            const block = {
              type: "globalBlock",
              uid: data.block.id,
              compile: compiled
            } as OutputTypes[T];

            res(block);
          } catch (e) {
            rej(t("Fail to compile global block"));
          }
        })();

        break;
      }
    }
  });
};
