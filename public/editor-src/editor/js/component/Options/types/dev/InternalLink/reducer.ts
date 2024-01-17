import { ChoicesSync } from "./types";
import { Status } from "visual/component/Controls/InternalLink/types";

export interface State {
  items: ChoicesSync;
  status: Status;
  loading: boolean;
  postType: string;
}

export enum ActionTypes {
  SET_ITEMS = "SET_ITEMS",
  SET_STATUS = "SET_STATUS",
  SET_LOADING = "SET_LOADING",
  SET_POST_TYPE = "SET_POST_TYPE",
  SET_MULTIPLE = "SET_MULTIPLE"
}

interface SET_ITEMS {
  type: ActionTypes.SET_ITEMS;
  payload: ChoicesSync;
}

interface SET_STATUS {
  type: ActionTypes.SET_STATUS;
  payload: Status;
}

interface SET_LOADING {
  type: ActionTypes.SET_LOADING;
  payload: boolean;
}

interface SET_POST_TYPE {
  type: ActionTypes.SET_POST_TYPE;
  payload: string;
}

interface SET_MULTIPLE {
  type: ActionTypes.SET_MULTIPLE;
  payload: Partial<State>;
}

export type Action =
  | SET_ITEMS
  | SET_STATUS
  | SET_LOADING
  | SET_POST_TYPE
  | SET_MULTIPLE;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SET_MULTIPLE: {
      return {
        ...state,
        ...action.payload
      };
    }
    case ActionTypes.SET_ITEMS: {
      return {
        ...state,
        items: action.payload
      };
    }
    case ActionTypes.SET_STATUS: {
      return {
        ...state,
        status: action.payload
      };
    }
    case ActionTypes.SET_LOADING: {
      return {
        ...state,
        loading: Boolean(action.payload)
      };
    }
    case ActionTypes.SET_POST_TYPE: {
      return {
        ...state,
        postType: action.payload
      };
    }
  }
};
