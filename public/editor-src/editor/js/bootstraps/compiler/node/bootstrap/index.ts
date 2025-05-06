import deepMerge from "deepmerge";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { isPopup, isStory } from "visual/providers/EditorModeProvider";
import { hydrate } from "visual/redux/actions";
import { pageBlocksDataSelector } from "visual/redux/selectors";
import { createStore } from "visual/redux/store";
import { GoogleFont } from "visual/types/Fonts";
import { isGlobalBlock, isGlobalPopup } from "visual/types/utils";
import { getGoogleFonts } from "visual/utils/fonts/getGoogleFonts";
import { findFonts } from "visual/utils/fonts/transform";
import { systemFont } from "visual/utils/fonts/utils";
import { getUsedModelFontFamily } from "visual/utils/options/getDetailsModelFontFamily";
import { parseGlobalBlocksToRecord } from "visual/utils/reader/globalBlocks";
import { getBlocksStylesFonts } from "visual/utils/traverse";
import { readPageData } from "../../../common/adapter";
import { compileProject } from "../../common/compileProject";
import { globalBlocksToStatic } from "../../common/toStatic/globalBlocksToStatic";
import { globalPopupsToStatic } from "../../common/toStatic/globalPopupsToStatic";
import { pageToStatic } from "../../common/toStatic/pageToStatic";
import { popupToStatic } from "../../common/toStatic/popupToStatic";
import { storyToStatic } from "../../common/toStatic/storyToStatic";
import {
  getRootAttr,
  getRootClassNames
} from "../../common/utils/prepareHTML/utils";
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

  // TODO: Need to know what context is, because it is node compiler, set context="view"
  const googleFonts = await getGoogleFonts({ config, renderContext: "view" });

  getBlocksStylesFonts(parsedFonts, fonts).forEach(({ type, family }) => {
    if (type === "google" || type === "unknowns") {
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
  const editorMode = config.mode;

  store.dispatch(
    //@ts-expect-error: Need to move Hydrate reducers to ts
    hydrate({
      page,
      project,
      fonts: _fonts,
      globalBlocks,
      projectStatus: {},
      config,
      editorMode
    })
  );

  const compiledProject = {
    styles: compileProject(config, store)
  };

  const commonConfig = { store, config, editorMode };
  let globalPopupsStatic = undefined;
  const globalPopupsInPage = Object.values(globalBlocks).filter(isGlobalPopup);

  if (isPopup(editorMode)) {
    if (globalPopupsInPage.length > 0) {
      try {
        globalPopupsStatic = globalPopupsToStatic({
          ...commonConfig,
          compiledBlocks: globalPopupsInPage
        });
      } catch (e) {
        console.error(e);
      }
    }

    const rootClassNames = getRootClassNames(config);
    const rootAttributes = getRootAttr(config, store);
    const pageBlocks = pageBlocksDataSelector(store.getState(), config);
    const blockStatic = pageBlocks.map((block) => ({
      id: block.value._id,
      ...popupToStatic({ ...commonConfig, block })
    }));

    return {
      page: {
        blocks: blockStatic,
        rootAttributes,
        rootClassNames
      },
      project: compiledProject,
      globalBlocks: globalPopupsStatic
    };
  }

  if (globalPopupsInPage.length > 0) {
    try {
      globalPopupsStatic = globalPopupsToStatic({
        ...commonConfig,
        compiledBlocks: globalPopupsInPage
      });
    } catch (e) {
      console.error(e);
    }
  }

  if (isStory(editorMode)) {
    const pageBlocks = pageBlocksDataSelector(store.getState(), config);
    const blockStatic = pageBlocks.map((block) => ({
      id: block.value._id,
      ...storyToStatic({ ...commonConfig, block })
    }));

    return {
      page: {
        blocks: blockStatic,
        rootClassNames: [
          "brz brz-root__container brz-reset-all brz-root__container-story"
        ]
      },
      project: compiledProject,
      globalBlocks: globalPopupsStatic
    };
  }

  const globalBlocksInPage = Object.values(globalBlocks).filter(isGlobalBlock);
  const globalBlocksStatic =
    globalBlocksInPage.length > 0
      ? globalBlocksToStatic({
          ...commonConfig,
          compiledBlocks: globalBlocksInPage
        })
      : undefined;

  const pageStatic = pageToStatic({ ...commonConfig });
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
