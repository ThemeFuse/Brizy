import { Actions } from "./actions";
import { Choices } from "./types";

export interface State {
  choices: Choices;
  loading: boolean;
  error?: string;
}

export function reducer(state: State, action: Actions): State {
  switch (action.type) {
    case "Init": {
      return { ...state, choices: [] };
    }
    case "FetchSuccess": {
      return {
        loading: false,
        choices: action.payload
      };
    }
    case "FetchError": {
      return {
        loading: false,
        error: action.payload,
        choices: []
      };
    }
  }
}

export const initState: State = {
  loading: true,
  choices: []
};
