import deepMerge from "deepmerge";
import { isPopup, isStory } from "visual/providers/EditorModeProvider";
import { hydrate } from "visual/redux/actions";
import { pageBlocksDataSelector } from "visual/redux/selectors";
import { createStore } from "visual/redux/store";
import { systemFont } from "visual/utils/fonts/utils";
import { compileProject } from "../../common/compileProject";
import { blockToStatic } from "../../common/toStatic/blockToStatic";
import { popupToStatic } from "../../common/toStatic/popupToStatic";
import { storyToStatic } from "../../common/toStatic/storyToStatic";
import { GlobalBlockRecord, Props, Static } from "./types";

export async function bootstrap(data: Props): Promise<Static> {
  const { config, page, project, editorMode } = data;
  const { globalBlocks: _globalBlocks = [], symbols } = config;
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
      config,
      projectStatus: {},
      editorMode,
      symbols
    })
  );
  const pageBlocks = pageBlocksDataSelector(store.getState(), config);
  const commonConfig = { store, config, editorMode };
  const compiledProject = {
    styles: compileProject(config, store)
  };

  if (isPopup(editorMode)) {
    const blockStatic = pageBlocks.map((block) => ({
      id: block.value._id,
      block: popupToStatic({ ...commonConfig, block })
    }));

    return {
      project: compiledProject,
      blocks: blockStatic
    };
  }

  if (isStory(editorMode)) {
    const blockStatic = pageBlocks.map((block) => ({
      id: block.value._id,
      block: storyToStatic({ ...commonConfig, block })
    }));

    return {
      project: compiledProject,
      blocks: blockStatic
    };
  }

  const blockStatic = pageBlocks.map((block) => ({
    id: block.value._id,
    block: blockToStatic({ ...commonConfig, block })
  }));

  return {
    project: compiledProject,
    blocks: blockStatic
  };
}
