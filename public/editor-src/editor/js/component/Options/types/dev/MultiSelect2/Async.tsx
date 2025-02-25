import { difference } from "es-toolkit";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
} from "react";
import {
  MultiSelect as Control,
  MultiSelectItem as ControlItem
} from "visual/component/Controls/MultiSelect2";
import { MultiSelectItemProps as ControlItemProps } from "visual/component/Controls/MultiSelect2/types";
import { OnChange } from "visual/component/Options/Type";
import { ChoicesAsync, ChoicesSync, Props, Value, ValueItem } from "./types";
import { mergeChoices, missingChoices } from "./utils";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return (): void => {
      clearTimeout(handler);
    };
  }, [value, delay]);

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
    | "FETCH_NOT_FOUND"
    | "SELECTED";
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
            state: "SELECTED",
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
    case "SELECTED":
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

export const Async = ({
  placeholder,
  choices,
  value: { value },
  config,
  onChange
}: Omit<Props, "choices"> & {
  choices: ChoicesAsync;
}): ReactElement => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const debouncedSearch = useDebounce(state.search, 1000);
  const currentSearchController = useRef<AbortController>();
  const initialChoices = useRef<ChoicesSync>([]);
  const { vChoices, sChoices, state: currentState } = state;
  const { useAsSimpleSelect = false, showArrow = false } = config ?? {};

  const _onChange = useCallback<OnChange<Value>>(
    (v): void => {
      const cachedChoices = initialChoices.current;
      const allChoices = [...vChoices, ...sChoices];
      const choices = v
        .map((vv) => allChoices.find((item) => item.value === vv))
        .filter((item) => item !== undefined) as ChoicesSync;

      const diffBySearch = difference(
        v,
        sChoices.map((choice) => choice.value)
      );

      if (
        sChoices.length === 0 ||
        diffBySearch.length > 0 ||
        choices.length < cachedChoices.length
      ) {
        initialChoices.current = choices;
      }

      dispatch({ type: "value_changed", choices });
      onChange({ value: v });
    },
    [onChange, vChoices, sChoices]
  );

  useEffect(() => {
    let controller: AbortController;

    if (value.length === 0) {
      dispatch({ type: "idle" });
    } else if (value.length > 0) {
      dispatch({ type: "loading" });

      controller = new AbortController();
      choices
        .load(value, controller.signal)
        .then((r) => {
          if (!controller.signal.aborted) {
            initialChoices.current = r;
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
  }, [choices, value]);

  useEffect(() => {
    if (debouncedSearch !== "") {
      dispatch({ type: "search_debounce_success" });

      const controller = new AbortController();
      currentSearchController.current = controller;

      choices
        .search(debouncedSearch, controller.signal)
        .then((r) => {
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
  }, [debouncedSearch, choices]);

  const isIdle = useMemo(() => currentState === "IDLE", [currentState]);
  const isSelected = useMemo(() => currentState === "SELECTED", [currentState]);
  const isLoading = useMemo(() => currentState === "LOADING", [currentState]);
  const isFetching = useMemo(() => currentState === "FETCHING", [currentState]);
  const isFetchNotFound = useMemo(
    () => currentState === "FETCH_NOT_FOUND",
    [currentState]
  );

  useEffect(() => {
    if (isIdle) {
      initialChoices.current = vChoices;
    }
  }, [isIdle, vChoices]);

  const _choices = useMemo(() => {
    return isSelected
      ? mergeChoices(
          missingChoices(value, vChoices),
          initialChoices.current,
          sChoices
        )
      : mergeChoices(missingChoices(value, vChoices), vChoices, sChoices);
  }, [isSelected, sChoices, vChoices, value]);

  return (
    <Control<ValueItem>
      value={value}
      valueIsLoading={isLoading}
      placeholder={placeholder}
      search={true}
      searchIsLoading={isFetching}
      searchIsEmpty={isFetchNotFound}
      onChange={_onChange}
      useAsSimpleSelect={useAsSimpleSelect}
      showArrow={showArrow}
      onSearchChange={(s): void => {
        currentSearchController.current?.abort();
        dispatch(
          s === ""
            ? { type: "search_erased" }
            : { type: "search_changed", search: s }
        );
      }}
    >
      {_choices.map(choiceToItem)}
    </Control>
  );
};
