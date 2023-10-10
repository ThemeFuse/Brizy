import { ElementModelValue } from "../../dev/Select/types";

interface State {
  isOpen: boolean;
  placeholder: string;
  entityType: ElementModelValue;
  entityId: ElementModelValue;
}

export enum ActionTypes {
  SET_VISIBILITY = "SET_VISIBILITY",
  SET_ENTITY_TYPE = "SET_ENTITY_TYPE",
  SET_ENTITY_ID = "SET_ENTITY_ID",
  SET_PLACEHOLDER = "SET_PLACEHOLDER"
}

interface SET_VISIBILITY {
  type: ActionTypes.SET_VISIBILITY;
  payload: boolean;
}

interface SET_ENTITY_TYPE {
  type: ActionTypes.SET_ENTITY_TYPE;
  payload: ElementModelValue;
}

interface SET_ENTITY_ID {
  type: ActionTypes.SET_ENTITY_ID;
  payload: ElementModelValue;
}

interface SET_PLACEHOLDER {
  type: ActionTypes.SET_PLACEHOLDER;
  payload: string;
}

export type Action =
  | SET_VISIBILITY
  | SET_ENTITY_TYPE
  | SET_ENTITY_ID
  | SET_PLACEHOLDER;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SET_VISIBILITY: {
      return {
        ...state,
        isOpen: Boolean(action.payload)
      };
    }
    case ActionTypes.SET_PLACEHOLDER: {
      return {
        ...state,
        placeholder: action.payload,
        entityType: { value: "" },
        entityId: { value: "" }
      };
    }
    case ActionTypes.SET_ENTITY_TYPE: {
      return {
        ...state,
        entityType: action.payload,
        entityId: { value: "" }
      };
    }
    case ActionTypes.SET_ENTITY_ID: {
      return {
        ...state,
        entityId: action.payload
      };
    }
    default:
      return state;
  }
};
