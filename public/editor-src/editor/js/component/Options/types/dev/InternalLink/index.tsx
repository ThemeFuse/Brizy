import { debounce } from "es-toolkit";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef
} from "react";
import { Control } from "visual/component/Controls/InternalLink";
import { Status } from "visual/component/Controls/InternalLink/types";
import { ToastNotification } from "visual/component/Notifications";
import { useConfig } from "visual/global/hooks";
import { read } from "visual/utils/reader/string";
import { Literal } from "visual/utils/types/Literal";
import { ActionTypes, State, reducer } from "./reducer";
import type { ChoiceWithPermalink, DebouncedSearch, Props } from "./types";
import { ChoicesSync } from "./types";
import { getCollectionChoices, isValidValue, normalizeItems } from "./utils";

export const InternalLink = ({
  className,
  onChange,
  value,
  label,
  placeholder,
  config
}: Props): ReactElement => {
  const globalConfig = useConfig();
  const api = globalConfig.api;

  const { handler, choices } = useMemo(() => {
    const { handler } = api?.collectionItems?.searchCollectionItems ?? {};

    const choices = getCollectionChoices(api);
    return { handler, choices };
  }, [api]);

  const source = value?.source ?? "";

  const lastPostType = useRef<string>(source);
  const debouncedSearch = useRef<DebouncedSearch>();

  const [state, dispatch] = useReducer(reducer, {
    items: value && isValidValue(value) ? [value] : [],
    status: Status.INITIAL,
    loading: false,
    postType: source
  });

  const dispatchLoading = useCallback(
    (loading: boolean) => {
      dispatch({
        type: ActionTypes.SET_LOADING,
        payload: loading
      });
    },
    [dispatch]
  );

  const dispatchMultiple = useCallback(
    (payload: Partial<State>) => {
      dispatch({
        type: ActionTypes.SET_MULTIPLE,
        payload
      });
    },
    [dispatch]
  );

  const { items, status, loading, postType } = state;

  const _onChange = useCallback(
    (v: ChoiceWithPermalink) =>
      onChange({
        title: v.title,
        value: String(v.value),
        source: postType
      }),
    [onChange, postType]
  );

  const resetValue = useCallback(() => {
    dispatch({
      type: ActionTypes.SET_ITEMS,
      payload: []
    });
    _onChange({ title: "", value: "", source: postType });
  }, [_onChange, postType, dispatch]);

  const onChangePostType = useCallback(
    ({ value }: { value: Literal }) => {
      const _value = read(value) ?? "";
      dispatch({
        type: ActionTypes.SET_POST_TYPE,
        payload: _value
      });
    },
    [dispatch]
  );

  useEffect(() => {
    if (lastPostType.current !== postType) {
      resetValue();
      lastPostType.current = postType;
    }
  }, [postType, resetValue]);

  useEffect(() => {
    debouncedSearch.current = debounce((search: string) => {
      if (postType && search && search.trim() !== "" && handler) {
        dispatchLoading(true);

        const res = (r: ChoicesSync) => {
          if (r.length > 0) {
            dispatchMultiple({
              items: normalizeItems(r),
              status: Status.SUCCESS
            });
          } else {
            dispatchMultiple({
              items: [],
              status: Status.NO_RESULT
            });
          }
          dispatchLoading(false);
        };

        const rej = (errMsg: string) => {
          dispatchMultiple({
            loading: false,
            status: Status.ERROR
          });

          ToastNotification.error(errMsg);
        };

        handler(res, rej, {
          collectionId: postType,
          search
        });
      }
    }, 1000);

    return () => {
      debouncedSearch.current?.cancel();
    };
  }, [postType, handler, dispatchLoading, dispatchMultiple]);

  const onSearchChange = useCallback(
    (searchValue: string): void => {
      debouncedSearch?.current?.(searchValue);
      if (!searchValue) {
        dispatchMultiple({
          status: Status.INITIAL,
          items: []
        });
      }
    },
    [dispatchMultiple]
  );

  return (
    <Control
      className={className ?? ""}
      value={value}
      label={label}
      placeholder={placeholder}
      resetValue={resetValue}
      items={items}
      source={postType}
      sourceHelper={config?.helper}
      sourceLabel={config?.sourceLabel}
      choices={choices}
      status={status}
      loading={loading}
      onChange={_onChange}
      onSearch={onSearchChange}
      onSourceChange={onChangePostType}
    />
  );
};
