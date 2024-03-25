import deepMerge from "deepmerge";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { hydrate } from "visual/redux/actions";
import { createStore } from "visual/redux/store";
import { GoogleFont } from "visual/types";
import { isGlobalBlock, isGlobalPopup } from "visual/types/utils";
import { findFonts, getGoogleFonts } from "visual/utils/fonts";
import { systemFont } from "visual/utils/fonts/utils";
import { isPopup, isStory } from "visual/utils/models";
import { getUsedModelFontFamily } from "visual/utils/options/getDetailsModelFontFamily";
import { parseGlobalBlocksToRecord } from "visual/utils/reader/globalBlocks";
import { getBlocksStylesFonts } from "visual/utils/traverse";
import { readPageData } from "../../../common/adapter";
import "../../../registerEditorParts";
import { compileProject } from "../../common/compileProject";
import { globalBlocksToStatic } from "../../common/toStatic/globalBlocksToStatic";
import { globalPopupsToStatic } from "../../common/toStatic/globalPopupsToStatic";
import { pageToStatic } from "../../common/toStatic/pageToStatic";
import { popupToStatic } from "../../common/toStatic/popupToStatic";
import { storyToStatic } from "../../common/toStatic/storyToStatic";
import { Static } from "./types";

export async function bootstrap(config: ConfigCommon): Promise<Static> {
  const store = createStore();
  const project = config.projectData;
  const _page = config.pageData;

  if (!project || !project.data) {
    throw new Error("Missing project data in config");
  }

  if (!_page || !_page.data) {
    throw new Error("Missing page data in config");
  }

  const page = readPageData(_page);
  const globalBlocks = parseGlobalBlocksToRecord(config.globalBlocks) ?? {};
  const { fonts } = project.data;

  // NEW FONTS FOUND
  // some fonts are found in models
  // that are not present in project
  // we need to find them in google
  // and add them to the project
  const parsedFonts = getUsedModelFontFamily();
  const blocksFonts: Array<GoogleFont> = [];
  const googleFonts = await getGoogleFonts();

  getBlocksStylesFonts(parsedFonts, fonts).forEach(({ type, family }) => {
    if (type === "google" || type === "unknowns") {
      // @ts-expect-error: Temporary
      const font = findFonts(googleFonts, family);

      if (font) {
        blocksFonts.push(font);
      }
    }
  });

  const _fonts = deepMerge(fonts, {
    blocks: { data: blocksFonts },
    system: { data: systemFont }
  });

  store.dispatch(
    //@ts-expect-error: Need to move Hydrate reducers to ts
    hydrate({
      page,
      project,
      fonts: _fonts,
      globalBlocks,
      projectStatus: {}
    })
  );

  const compiledProject = {
    styles: compileProject(config)
  };

  if (isPopup(config)) {
    const data = await popupToStatic({ store, config });
    return { page: data, project: compiledProject };
  }

  const commonConfig = { store, config };

  // GlobalPopup exists only in Story and Page mode.
  // When the mode is Popup, there's no need to compile it.
  if (isStory(config)) {
    const data = await storyToStatic(commonConfig);
    return { page: data, project: compiledProject };
  }

  const needToCompile = {
    page,
    project,
    globalBlocks: Object.values(globalBlocks)
  };

  const compiledGlobalBlocks = needToCompile.globalBlocks;
  const compiledPopups = compiledGlobalBlocks.filter(isGlobalPopup);
  let globalPopupsStatic = undefined;

  if (compiledPopups.length > 0) {
    try {
      globalPopupsStatic = await globalPopupsToStatic({
        ...commonConfig,
        compiledBlocks: compiledPopups
      });
    } catch (e) {
      console.error(e);
    }
  }

  const globalBlocksStatic =
    compiledGlobalBlocks.length > 0
      ? await globalBlocksToStatic({
          ...commonConfig,
          compiledBlocks: compiledGlobalBlocks.filter(isGlobalBlock)
        })
      : undefined;
  const pageStatic = await pageToStatic(commonConfig);
  const allStaticGlobalBlocks = [
    ...(globalPopupsStatic ?? []),
    ...(globalBlocksStatic ?? [])
  ];

  return {
    page: pageStatic,
    globalBlocks:
      allStaticGlobalBlocks.length > 0 ? allStaticGlobalBlocks : undefined,
    project: compiledProject
  };
}
