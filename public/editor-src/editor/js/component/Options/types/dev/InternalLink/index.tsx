import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import _ from "underscore";
import { Control } from "visual/component/Controls/InternalLink";
import { Status } from "visual/component/Controls/InternalLink/types";
import { ToastNotification } from "visual/component/Notifications";
import Config from "visual/global/Config";
import type { ChoiceWithPermalink, DebouncedSearch, Props } from "./types";
import { ChoicesSync } from "./types";
import { normalizeItems } from "./utils";

export const InternalLink: React.FC<Props> = ({
  className,
  onChange,
  value,
  label,
  placeholder,
  config
}) => {
  const { postType = "" } = config ?? {};

  const { handler } = useMemo(() => {
    const editorConfig = Config.getAll();
    const { handler } =
      editorConfig?.api?.collectionItems?.searchCollectionItems ?? {};

    return { handler };
  }, []);

  const lastPostType = useRef<string>();
  const debouncedSearch = useRef<DebouncedSearch>();
  const [items, setItems] = useState<ChoicesSync>(value ? [value] : []);
  const [status, setStatus] = useState<Status>(Status.INITIAL);
  const [loading, setLoading] = useState<boolean>(false);

  const _onChange = useCallback(
    (v: ChoiceWithPermalink) =>
      onChange({ title: v.title, value: String(v.value) }),
    [onChange]
  );

  const resetValue = useCallback(() => {
    setItems([]);
    _onChange({ title: "", value: "" });
  }, [_onChange]);

  useEffect(() => {
    if (postType && lastPostType.current !== postType) {
      resetValue();
      lastPostType.current = postType;
    }
  }, [postType, resetValue]);

  useEffect(() => {
    debouncedSearch.current = _.debounce((search: string) => {
      if (postType && search && search.trim() !== "" && handler) {
        setLoading(true);

        const res = (r: ChoicesSync) => {
          if (r.length > 0) {
            setItems(r);
            setStatus(Status.SUCCESS);
          } else {
            setItems([]);
            setStatus(Status.NO_RESULT);
          }
          setLoading(false);
        };

        const rej = (errMsg: string) => {
          setLoading(false);
          setStatus(Status.ERROR);
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
  }, [postType, handler]);

  const onSearchChange = useCallback((searchValue: string): void => {
    debouncedSearch?.current?.(searchValue);
    if (!searchValue) {
      setItems([]);
      setStatus(Status.INITIAL);
    }
  }, []);

  const _items = normalizeItems(items);

  return (
    <>
      {label}
      <Control
        className={className ?? ""}
        value={value}
        placeholder={placeholder}
        resetValue={resetValue}
        items={_items}
        status={status}
        loading={loading}
        onChange={_onChange}
        onSearch={onSearchChange}
      />
    </>
  );
};
