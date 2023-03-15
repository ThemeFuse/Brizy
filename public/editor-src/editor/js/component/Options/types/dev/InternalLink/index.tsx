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
import { Choice } from "../Select/types";
import type { DebouncedSearch, Props } from "./types";
import { Post } from "./types/Post";
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

  const { label: configLabel, handlerSearch } = useMemo(() => {
    const editorConfig = Config.getAll();

    const { label, handlerSearch } = editorConfig?.api?.linkPages ?? {};

    return { label, handlerSearch };
  }, [Config.getAll()]);

  const lastPostType = useRef<string>(postType);
  const debouncedSearch = useRef<DebouncedSearch>();
  const [items, setItems] = useState<Post[]>(value ? [value] : []);
  const [status, setStatus] = useState<Status>(Status.INITIAL);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (postType && lastPostType.current !== postType) {
      resetValue();
      lastPostType.current = postType;
    }
  }, [postType]);

  useEffect(() => {
    debouncedSearch.current = _.debounce((search: string) => {
      if (postType && search && search.trim() !== "" && handlerSearch) {
        setLoading(true);

        const res = (r: Post[]) => {
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

        handlerSearch(res, rej, {
          id: postType,
          search
        });
      }
    }, 1000);

    return () => {
      debouncedSearch.current?.cancel();
    };
  }, [postType]);

  const onSearchChange = (searchValue: string): void => {
    debouncedSearch?.current?.(searchValue);
    if (!searchValue) {
      setItems([]);
      setStatus(Status.INITIAL);
    }
  };

  const resetValue = () => {
    setItems([]);
    _onChange({ title: "", value: "" });
  };

  const _onChange = useCallback(
    (v: Choice) => onChange({ id: String(v.value), title: v.title }),
    [onChange]
  );

  const _items = normalizeItems(items);

  return (
    <>
      {configLabel ?? label}
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
