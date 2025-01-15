import { Action, createStore } from "redux";
import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";

const __MOCKED_VISUAL_CONFIG__ = {
  urls: {
    editorIcons: "/"
  }
} as unknown as ConfigCommon;

const initialState = {
  configId: "mockvisual"
};

function configIdReducer(state = initialState, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}

// TODO: in future meybe we need to use store instance with structure like our real production store
const store = createStore(configIdReducer);

export { store, __MOCKED_VISUAL_CONFIG__ as config };
