import { fromJS } from "immutable";
import _ from "underscore";
import {
  changedGBIdsSelector,
  globalBlocksAssembledSelector,
  pageSelector,
  projectSelector
} from "visual/redux/selectors";
import { GlobalBlock, Page, Project } from "visual/types";
import { isStory } from "visual/utils/models";
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
  config,
  apiHandler
}: Data) {
  if (action.type === PUBLISH) {
    const { onSuccess = _.noop, onError = _.noop } = action.meta ?? {};

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

    if (!isStory(config)) {
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
            const oldGlobalBlock = fromJS(oldGlobalBlocks[id]);
            const newGlobalBlock = fromJS(globalBlock);

            if (!oldGlobalBlock.equals(newGlobalBlock)) {
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
          allApi.push(apiPublish(_data));
          break;
        }
        case "external": {
          allApi.push(
            onUpdate({
              ..._data,
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
