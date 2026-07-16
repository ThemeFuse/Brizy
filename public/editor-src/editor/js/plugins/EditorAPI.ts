/**
 * Factory that assembles all plugin infrastructure parts (ToolServer, SlotRegistry,
 * FilterRegistry, EventBus) and the EditorAPI object passed to plugins.
 */
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { updateUI } from "visual/redux/actions2";
import {
  blocksHtmlSelector,
  pageBlocksDataSelector,
  projectAssembled,
  uiSelector
} from "visual/redux/selectors";
import type { TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import type { Translation } from "visual/utils/i18n/t";
import { getVisibleSectionIds } from "visual/utils/viewport";
import { EventBusImpl } from "./EventBus";
import { FilterRegistryImpl } from "./FilterRegistry";
import { SharedStore } from "./SharedStore";
import { SlotRegistryImpl } from "./SlotRegistry";
import { ToolServerImpl } from "./ToolServer";
import type { EditorAPI } from "./types";

export interface EditorAPIParts {
  toolServer: ToolServerImpl;
  slotRegistry: SlotRegistryImpl;
  filterRegistry: FilterRegistryImpl;
  eventBus: EventBusImpl;
  api: EditorAPI;
}

interface Props {
  getState: () => ReduxState;
  dispatch: TypedDispatch;
  config: ConfigCommon;
  t: Translation;
}

export function createEditorAPI(props: Props): EditorAPIParts {
  const { getState, dispatch, config, t } = props;
  const store = new SharedStore();
  const toolServer = new ToolServerImpl(getState, dispatch, config, store);
  const slotRegistry = new SlotRegistryImpl();
  const filterRegistry = new FilterRegistryImpl();
  const eventBus = new EventBusImpl();

  // State size cache — JSON.stringify is expensive on large state
  let cachedSize = 0;
  let lastSizeMeasure = 0;

  const api: EditorAPI = {
    toolServer,
    slots: slotRegistry,
    filters: filterRegistry,
    events: eventBus,
    t,
    store,
    getBlocksHtml: () => {
      const blocks = Object.entries(blocksHtmlSelector(getState()).blocks);

      return blocks.map(([id, data]) => {
        if ("assets" in data) {
          return {
            id,
            html: data.html,
            assets: data.assets
          };
        }

        return {
          id,
          html: data.html
        };
      });
    },
    getVisibleSectionsIds: () => {
      try {
        return getVisibleSectionIds(document, window.innerHeight);
      } catch {
        return [];
      }
    },
    getPageData: () => pageBlocksDataSelector(getState(), config),
    getProjectData: () => projectAssembled(getState()).data,
    getPageId: () => getState().page?.id ?? "",
    getProjectId: () => getState().project?.id ?? "",
    getBlockCount: () => getState().blocksOrder?.length ?? 0,
    getStateSize: () => {
      const now = Date.now();
      if (now - lastSizeMeasure > 5000) {
        lastSizeMeasure = now;
        const measure = (): void => {
          try {
            cachedSize = new Blob([JSON.stringify(getState())]).size;
          } catch {
            // state may not be serializable
          }
        };
        if (typeof requestIdleCallback !== "undefined") {
          requestIdleCallback(measure);
        } else {
          measure();
        }
      }
      return cachedSize;
    },
    getHistoryInfo: () => {
      const state = getState() as ReduxState & {
        history?: { canUndo: boolean; canRedo: boolean };
      };
      const history = state.history;
      return {
        current: history ? (history.canUndo ? 1 : 0) : 0,
        max: 20,
        snapshotCount: history
          ? history.canUndo || history.canRedo
            ? 2
            : 1
          : 0
      };
    },
    openHelpSidebar: () => {
      const { rightSidebar } = uiSelector(getState());

      dispatch(
        updateUI("rightSidebar", {
          ...rightSidebar,
          isOpen: true,
          type: "help"
        })
      );
    }
  };

  return { toolServer, slotRegistry, filterRegistry, eventBus, api };
}
