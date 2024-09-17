import deepMerge from "deepmerge";
import { hydrate } from "visual/redux/actions";
import { createStore } from "visual/redux/store";
import { isGlobalBlock, isGlobalPopup } from "visual/types/utils";
import { systemFont } from "visual/utils/fonts/utils";
import { isPopup, isStory } from "visual/utils/models";
import { MValue } from "visual/utils/value";
import "../../../registerEditorParts";
import { globalBlocksToStatic } from "../../common/toStatic/globalBlocksToStatic";
import { globalPopupsToStatic } from "../../common/toStatic/globalPopupsToStatic";
import { pageToStatic } from "../../common/toStatic/pageToStatic";
import { popupToStatic } from "../../common/toStatic/popupToStatic";
import { storyToStatic } from "../../common/toStatic/storyToStatic";
import { GlobalBlockRecord, GlobalBlockStatic, Props, Static } from "./types";

export async function bootstrap(data: Props): Promise<Static> {
  const {
    config,
    page,
    project,
    globalBlocks: _globalBlocks,
    needToCompile
  } = data;
  const { fonts } = project.data;
  const store = createStore();
  const globalBlocks =
    _globalBlocks?.reduce<GlobalBlockRecord>((acc, block) => {
      acc[block.uid] = block;
      return acc;
    }, {}) ?? {};

  const _fonts = deepMerge(fonts, {
    system: { data: systemFont }
  });

  store.dispatch(
    //@ts-expect-error: To Ts
    hydrate({
      page,
      project,
      fonts: _fonts,
      globalBlocks,
      projectStatus: {}
    })
  );
  const commonConfig = { store, config };
  const compiledGlobalBlocks = needToCompile.globalBlocks ?? [];
  const compiledPopups = compiledGlobalBlocks.filter(isGlobalPopup);
  let globalPopupsStatic: MValue<Array<GlobalBlockStatic>> = undefined;

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

  if (isPopup(config)) {
    const data = await popupToStatic(commonConfig);
    return { page: data, globalBlocks: globalPopupsStatic };
  }

  if (isStory(config)) {
    const data = await storyToStatic(commonConfig);
    return { page: data, globalBlocks: globalPopupsStatic };
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
      allStaticGlobalBlocks.length > 0 ? allStaticGlobalBlocks : undefined
  };
}
