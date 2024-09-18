import deepMerge from "deepmerge";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { hydrate } from "visual/redux/actions";
import { createStore } from "visual/redux/store";
import { GoogleFont } from "visual/types";
import { isGlobalBlock } from "visual/types/utils";
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
import {
  globalBlocksInPageSelector,
  globalPopupsInPageSelector
} from "visual/redux/selectors";
import { pipe } from "@brizy/readers";

const getGlobalBlocks = pipe(globalBlocksInPageSelector, Object.values, (o) =>
  o.filter(isGlobalBlock)
);

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

  const commonConfig = { store, config };
  const state = store.getState();
  const globalPopupsInPage = globalPopupsInPageSelector(state);
  let globalPopupsStatic = undefined;

  if (globalPopupsInPage.length > 0) {
    try {
      globalPopupsStatic = await globalPopupsToStatic({
        ...commonConfig,
        compiledBlocks: globalPopupsInPage
      });
    } catch (e) {
      console.error(e);
    }
  }

  if (isPopup(config)) {
    const data = await popupToStatic(commonConfig);
    return {
      page: data,
      project: compiledProject,
      globalBlocks: globalPopupsStatic
    };
  }

  if (isStory(config)) {
    const data = await storyToStatic(commonConfig);
    return {
      page: data,
      project: compiledProject,
      globalBlocks: globalPopupsStatic
    };
  }

  const globalBlocksInPage = getGlobalBlocks(state);
  const globalBlocksStatic =
    globalBlocksInPage.length > 0
      ? await globalBlocksToStatic({
          ...commonConfig,
          compiledBlocks: globalBlocksInPage
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
