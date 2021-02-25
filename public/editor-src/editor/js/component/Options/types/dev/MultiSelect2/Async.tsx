import React, {
  useReducer,
  useState,
  useEffect,
  useRef,
  ReactElement,
  FC
} from "react";
import {
  MultiSelect as Control,
  MultiSelectItem as ControlItem
} from "visual/component/Controls/MultiSelect2";
import { MultiSelectItemProps as ControlItemProps } from "visual/component/Controls/MultiSelect2/types";
import { ValueItem, Props, ChoicesSync, ChoicesAsync } from "./types";
import { toElement, mergeChoices, missingChoices } from "./utils";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return (): void => {
      clearTimeout(handler);
    };
  }, [value]);

  return debouncedValue;
}

type RState = {
  state:
    | "INACTIVE"
    | "LOADING"
    | "IDLE"
    | "HAS_INPUT"
    | "FETCHING"
    | "FETCH_FOUND"
    | "FETCH_NOT_FOUND";
  vChoices: ChoicesSync;
  sChoices: ChoicesSync;
  search: string;
};
type RAction =
  | {
      type: "idle";
    }
  | {
      type: "loading";
    }
  | {
      type: "load_success";
      choices: ChoicesSync;
    }
  | {
      type: "load_fail";
    }
  | {
      type: "search_changed";
      search: string;
    }
  | {
      type: "search_erased";
    }
  | {
      type: "search_debounce_success";
    }
  | {
      type: "fetch_found";
      choices: ChoicesSync;
    }
  | {
      type: "fetch_not_found";
    }
  | {
      type: "value_changed";
      choices: ChoicesSync;
    };

function reducer(state: RState, action: RAction): RState {
  switch (state.state) {
    case "INACTIVE":
      switch (action.type) {
        case "idle":
        case "loading":
          return {
            ...state,
            state: action.type === "idle" ? "IDLE" : "LOADING"
          };
      }
      break;
    case "LOADING":
      switch (action.type) {
        case "load_success":
        case "load_fail":
          return {
            ...state,
            state: "IDLE",
            vChoices: action.type === "load_success" ? action.choices : []
          };
      }
      break;
    case "IDLE":
      switch (action.type) {
        case "search_changed":
          return {
            ...state,
            state: "HAS_INPUT",
            sChoices: [],
            search: action.search
          };
        case "value_changed":
          return {
            ...state,
            vChoices: action.choices
          };
      }
      break;
    case "HAS_INPUT":
      switch (action.type) {
        case "search_erased":
          return {
            ...state,
            state: "IDLE",
            sChoices: [],
            search: ""
          };
        case "search_changed":
          return {
            ...state,
            sChoices: [],
            search: action.search
          };
        case "search_debounce_success":
          return {
            ...state,
            state: "FETCHING"
          };
      }
      break;
    case "FETCHING":
      switch (action.type) {
        case "fetch_found":
          return {
            ...state,
            state: "FETCH_FOUND",
            sChoices: action.choices
          };
        case "fetch_not_found":
          return {
            ...state,
            state: "FETCH_NOT_FOUND",
            sChoices: []
          };
        case "search_erased":
          return {
            ...state,
            state: "IDLE",
            sChoices: [],
            search: ""
          };
        case "search_changed":
          return {
            ...state,
            state: "HAS_INPUT",
            sChoices: [],
            search: action.search
          };
      }
      break;
    case "FETCH_FOUND":
      switch (action.type) {
        case "value_changed":
          return {
            ...state,
            vChoices: action.choices
          };
        case "search_erased":
          return {
            ...state,
            state: "IDLE",
            sChoices: [],
            search: ""
          };
        case "search_changed":
          return {
            ...state,
            state: "HAS_INPUT",
            sChoices: [],
            search: action.search
          };
      }
      break;
    case "FETCH_NOT_FOUND":
      switch (action.type) {
        case "search_erased":
          return {
            ...state,
            state: "IDLE",
            sChoices: [],
            search: ""
          };
        case "search_changed":
          return {
            ...state,
            state: "HAS_INPUT",
            sChoices: [],
            search: action.search
          };
      }
      break;
  }

  return state;
}
const initialState: RState = {
  state: "INACTIVE",
  vChoices: [],
  sChoices: [],
  search: ""
};

function choiceToItem({
  value,
  title
}: ChoicesSync[number]): ReactElement<ControlItemProps<ValueItem>> {
  return <ControlItem<ValueItem> key={value} title={title} value={value} />;
}

export const Async: FC<Omit<Props, "choices"> & { choices: ChoicesAsync }> = ({
  placeholder,
  choices,
  value: { value },
  onChange
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const debouncedSearch = useDebounce(state.search, 1000);
  const currentSearchController = useRef<AbortController>();

  useEffect(() => {
    let controller: AbortController;

    if (value.length === 0) {
      dispatch({ type: "idle" });
    } else if (value.length > 0) {
      dispatch({ type: "loading" });

      controller = new AbortController();
      choices
        .load(value, controller.signal)
        .then(r => {
          if (!controller.signal.aborted) {
            dispatch({ type: "load_success", choices: r });
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            dispatch({ type: "load_fail" });
          }
        });
    }

    return (): void => {
      controller?.abort();
    };
  }, []);

  useEffect(() => {
    if (debouncedSearch !== "") {
      dispatch({ type: "search_debounce_success" });

      const controller = new AbortController();
      currentSearchController.current = controller;

      choices
        .search(debouncedSearch, controller.signal)
        .then(r => {
          if (!controller.signal.aborted) {
            if (r.length > 0) {
              dispatch({ type: "fetch_found", choices: r });
            } else {
              dispatch({ type: "fetch_not_found" });
            }
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            dispatch({ type: "fetch_not_found" });
          }
        });
    }
  }, [debouncedSearch]);

  return (
    <Control<ValueItem>
      value={value}
      valueIsLoading={state.state === "LOADING"}
      placeholder={placeholder}
      search={true}
      searchIsLoading={state.state === "FETCHING"}
      searchIsEmpty={state.state === "FETCH_NOT_FOUND"}
      onChange={(v): void => {
        const allChoices = [...state.vChoices, ...state.sChoices];
        const choices = v
          .map(vv => allChoices.find(item => item.value === vv))
          .filter(item => item !== undefined) as ChoicesSync;

        dispatch({ type: "value_changed", choices });
        onChange(toElement(v));
      }}
      onSearchChange={(s): void => {
        currentSearchController.current?.abort();
        dispatch(
          s === ""
            ? { type: "search_erased" }
            : { type: "search_changed", search: s }
        );
      }}
    >
      {mergeChoices(
        missingChoices(value, state.vChoices),
        state.vChoices,
        state.sChoices
      ).map(choiceToItem)}
    </Control>
  );
};
