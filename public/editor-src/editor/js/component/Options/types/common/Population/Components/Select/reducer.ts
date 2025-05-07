import { SimpleValue } from "visual/component/Options/Type";
import { ElementModelValue } from "../../types/Value";

export interface State {
  isOpen: boolean;
  placeholder: string;
  entityType: SimpleValue<string>;
  entityId: ElementModelValue;
  isEntityTypeLoaded: boolean;
}

export enum ActionTypes {
  SET_VISIBILITY,
  SET_ENTITY_TYPE,
  SET_ENTITY_ID,
  SET_PLACEHOLDER,
  SET_IS_ENTITY_TYPE_LOADED,
  SET_BULK
}

interface SET_VISIBILITY {
  type: ActionTypes.SET_VISIBILITY;
  payload: boolean;
}

interface SET_ENTITY_TYPE {
  type: ActionTypes.SET_ENTITY_TYPE;
  payload: SimpleValue<string>;
}

interface SET_ENTITY_ID {
  type: ActionTypes.SET_ENTITY_ID;
  payload: ElementModelValue;
}

interface SET_PLACEHOLDER {
  type: ActionTypes.SET_PLACEHOLDER;
  payload: string;
}

interface SET_IS_ENTITY_TYPE_LOADED {
  type: ActionTypes.SET_IS_ENTITY_TYPE_LOADED;
  payload: boolean;
}

interface SET_BULK {
  type: ActionTypes.SET_BULK;
  payload: {
    isOpen?: boolean;
    placeholder?: string;
    entityType?: SimpleValue<string>;
    entityId?: ElementModelValue;
    isEntityTypeLoaded?: boolean;
  };
}

export type Action =
  | SET_VISIBILITY
  | SET_ENTITY_TYPE
  | SET_ENTITY_ID
  | SET_PLACEHOLDER
  | SET_IS_ENTITY_TYPE_LOADED
  | SET_BULK;

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
        placeholder: action.payload
      };
    }
    case ActionTypes.SET_ENTITY_TYPE: {
      return {
        ...state,
        entityType: action.payload,
        placeholder: "",
        entityId: { value: "" }
      };
    }
    case ActionTypes.SET_ENTITY_ID: {
      return {
        ...state,
        entityId: action.payload
      };
    }

    case ActionTypes.SET_IS_ENTITY_TYPE_LOADED: {
      return {
        ...state,
        isEntityTypeLoaded: action.payload
      };
    }

    case ActionTypes.SET_BULK: {
      return { ...state, ...action.payload };
    }

    default:
      return state;
  }
};
