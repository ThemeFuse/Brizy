import { isEqual, noop } from "es-toolkit";
import { isStory } from "visual/providers/EditorModeProvider";
import {
  changedGBIdsSelector,
  globalBlocksAssembledSelector,
  pageSelector,
  projectSelector
} from "visual/redux/selectors";
import { GlobalBlock } from "visual/types/GlobalBlock";
import { Page } from "visual/types/Page";
import { Project } from "visual/types/Project";
import { MValue, isT } from "visual/utils/value";
import { PUBLISH } from "../../actions2";
import { Data } from "./types";
import {
  apiPublish,
  debouncedApiAutoSave,
  debouncedApiPublish,
  onUpdate
} from "./utils";

export function handlePublish({
  action,
  state,
  oldState,
  getConfig,
  apiHandler,
  editorMode,
  store
}: Data) {
  if (action.type === PUBLISH) {
    const config = getConfig();

    const { onSuccess = noop, onError = noop } = action.meta ?? {};

    const oldProject = projectSelector(oldState);
    const project = projectSelector(state);

    const oldPage = pageSelector(oldState);
    const page = pageSelector(state);

    const globalBlocks = globalBlocksAssembledSelector(state);

    const apiAutosave = debouncedApiAutoSave(config.autoSaveInterval);

    const allApi = [];
    let data: MValue<{
      page?: Page;
      project?: Project;
      globalBlocks?: Array<GlobalBlock>;
    }> = undefined;

    if (!isStory(editorMode)) {
      const changedGBIds = changedGBIdsSelector(state);
      const oldGlobalBlocks = globalBlocksAssembledSelector(oldState);

      if (changedGBIds.length > 0 || oldGlobalBlocks !== globalBlocks) {
        const newGlobalBlocks = Object.entries(globalBlocks)
          .map(([id, globalBlock]) => {
            // Check the ChangedGBIds
            if (changedGBIds.includes(id)) {
              return globalBlock;
            }

            // Check the data from JSON
            if (!isEqual(oldGlobalBlocks[id], globalBlock)) {
              return globalBlock;
            }
          })
          .filter(isT);

        if (newGlobalBlocks.length > 0) {
          data = {
            globalBlocks: newGlobalBlocks
          };
        }
      }

      // cancel possible pending requests
      apiAutosave.cancel();
      debouncedApiPublish.cancel();
    }

    if (project !== oldProject) {
      data = data || {};
      data.project = project;
    }

    if (page !== oldPage) {
      data = data || {};
      data.page = page;
    }

    if (data) {
      const _data = {
        config,
        needToCompile: data,
        is_autosave: 0 as const,
        state: {
          project,
          page,
          globalBlocks: Object.values(globalBlocks)
        }
      };
      switch (action.payload.type) {
        case "internal": {
          allApi.push(
            apiPublish({
              store,
              is_autosave: _data.is_autosave,
              config: _data.config,
              needToCompile: _data.needToCompile
            })
          );
          break;
        }
        case "external": {
          allApi.push(
            onUpdate({
              store,
              onDone: action.payload.res,
              is_autosave: _data.is_autosave,
              config: _data.config,
              needToCompile: _data.needToCompile
            })
          );
          break;
        }
        case "externalForce": {
          // TODO: Needs to be reviewed because current implementation may not be correct
          allApi.push(
            onUpdate({
              config,
              is_autosave: 0,
              needToCompile: {
                project,
                page,
                globalBlocks: Object.values(globalBlocks)
              },
              store,
              onDone: action.payload.res
            })
          );
          break;
        }
      }
    }

    apiHandler(Promise.all(allApi), action, onSuccess, onError);
  }
}
