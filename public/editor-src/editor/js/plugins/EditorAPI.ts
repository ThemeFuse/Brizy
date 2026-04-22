/**
 * Factory that assembles all plugin infrastructure parts (ToolServer, SlotRegistry,
 * FilterRegistry, EventBus) and the EditorAPI object passed to plugins.
 */
import type { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import {
  blocksHtmlSelector,
  pageBlocksDataSelector,
  projectSelector
} from "visual/redux/selectors";
import type { TypedDispatch } from "visual/redux/store";
import type { ReduxState } from "visual/redux/types";
import type { Translation } from "visual/utils/i18n/t";
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
    getPageData: () => pageBlocksDataSelector(getState(), config),
    getProjectData: () => projectSelector(getState()).data
  };

  return { toolServer, slotRegistry, filterRegistry, eventBus, api };
}
