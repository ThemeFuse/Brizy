import deepMerge from "deepmerge";
import Config from "visual/global/Config";
import {
  isCollectionPage,
  isEcwidCategoryPage,
  isEcwidProductPage
} from "visual/global/Config/types/configs/Cloud";
import { hydrate } from "visual/redux/actions";
import { createStore } from "visual/redux/store";
import { isGlobalPopup } from "visual/types/utils";
import { findFonts, getGoogleFonts } from "visual/utils/fonts";
import { systemFont } from "visual/utils/fonts/utils";
import { isPopup, isStory } from "visual/utils/models";
import { getUsedModelFontFamily } from "visual/utils/options/getDetailsModelFontFamily";
import { parsePageCommon } from "visual/utils/reader/page";
import { parseProject } from "visual/utils/reader/project";
import * as Str from "visual/utils/reader/string";
import { getBlocksStylesFonts } from "visual/utils/traverse";
import { compileProject } from "../common/compileProject";
import { globalBlocksToStatic } from "../common/toStatic/globalBlocksToStatic";
import { globalPopupsToStatic } from "../common/toStatic/globalPopupsToStatic";
import { pageToStatic } from "../common/toStatic/pageToStatic";
import { popupToStatic } from "../common/toStatic/popupToStatic";
import { storyToStatic } from "../common/toStatic/storyToStatic";
import { parseGlobalBlocks } from "./utils/parseGlobalBlocks";

export default async function main({
  pageId,
  pages,
  project: project_,
  globalBlocks: globalBlocks_
}) {
  const page = pages
    .map((page) => {
      const parsedPage = parsePageCommon(page);

      if (!parsedPage) {
        return;
      }

      if (isEcwidProductPage(page)) {
        return {
          ...parsedPage,
          __type: "ecwid-product",
          productId: page.productId
        };
      }

      if (isEcwidCategoryPage(page)) {
        return {
          ...parsedPage,
          __type: "ecwid-product-category",
          categoryId: page.categoryId
        };
      }

      return isCollectionPage(page)
        ? {
            ...parsedPage,
            collectionType: page.collectionType,
            fields: page.fields
          }
        : {
            ...parsedPage,
            __type: page.__type
          };
    })
    .find((page) => {
      if (pageId) {
        const pageId1 = Str.read(page.id);
        const pageId2 = Str.read(pageId);

        return pageId1 && pageId2 && pageId1 === pageId2;
      } else {
        return page.is_index;
      }
    });

  if (!page) {
    throw new Error(`can not find page with id ${pageId}`);
  }

  const globalBlocks = parseGlobalBlocks(globalBlocks_);
  const project = parseProject(project_);

  if (!project) {
    throw new Error("Invalid project");
  }

  return {
    meta: getPageMeta({ page }),
    compiled: await getPageBlocks({ page, project, globalBlocks })
  };
}

function getPageMeta({ page }) {
  return {
    slug: page.slug || "",
    title: page.title || "",
    description: page.description || ""
  };
}

async function getPageBlocks({ page, project, globalBlocks }) {
  const store = createStore();
  const { fonts } = project.data;
  const config = Config.getAll();

  // NEW FONTS FOUND
  // some fonts are found in models
  // that are not present in project
  // we need to find them in google
  // and add them to the project
  const parsedFonts = getUsedModelFontFamily();
  let blocksFonts = [];
  const googleFonts = await getGoogleFonts();

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

  store.dispatch(
    hydrate({
      page,
      project,
      fonts: _fonts,
      globalBlocks,
      projectStatus: {}
    })
  );

  if (isPopup(config)) {
    const data = await popupToStatic({ store, config });
    return { page: data };
  }

  const needToCompile = {
    page,
    project,
    globalBlocks: Object.values(globalBlocks)
  };
  const compiledGlobalBlocks = needToCompile.globalBlocks;
  const commonConfig = { store, config };

  // GlobalPopup exists only in Story and Page mode.
  // When the mode is Popup, there's no need to compile it.
  const includedGlobalPopups = compiledGlobalBlocks.some(isGlobalPopup);
  let globalPopupsStatic = undefined;

  if (includedGlobalPopups) {
    try {
      globalPopupsStatic = await globalPopupsToStatic(commonConfig);
    } catch (e) {
      console.error(e);
    }
  }

  if (isStory(config)) {
    const data = await storyToStatic(commonConfig);
    return { page: data, globalBlocks: globalPopupsStatic };
  }

  const globalBlocksStatic =
    compiledGlobalBlocks.length > 0
      ? await globalBlocksToStatic({
          ...commonConfig,
          compiledBlocks: compiledGlobalBlocks
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
    project: {
      styles: compileProject(config)
    }
  };
}
