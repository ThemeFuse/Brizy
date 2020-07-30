import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Select2 } from "visual/component/Controls/Select2";
import {
  default as Option,
  GetModel,
  OptionType
} from "visual/component/Options/Type";
import {
  WithClassName,
  WithConfig,
  WithSize
} from "visual/utils/options/attributes";
import { mApply, MValue } from "visual/utils/value";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import { trimTitle, toElementValue } from "./utils";
import { getPosts } from "./store";
import { Post, read } from "./types/Post";
import { ElementValue, empty } from "./types/ElementValue";

export type Props = Option.Props<MValue<Post>, ElementValue> &
  WithConfig<WithSize> &
  WithClassName;

export type Component = OptionType<MValue<Post>> & FC<Props>;

export const InternalLink: Component = ({
  className,
  onChange,
  value,
  config
}) => {
  // Use this flag in order to track if the element is mounted, as there is
  // no way to cancel promises
  let unmounted = false;
  const ref = useRef<boolean>();
  const [items, setItems] = useState<Post[]>(value ? [value] : []);
  const _onChange = useCallback(
    (v: number) =>
      onChange(
        mApply(
          toElementValue,
          items.find(i => i.id === v)
        ) ?? empty
      ),
    [onChange, items]
  );
  const search = useCallback(
    (s: string, i: number): boolean =>
      items[i]?.title.toLowerCase().includes(s.toLowerCase()) ?? false,
    [items]
  );
  const loadPosts = (): void => {
    ref.current ||
      getPosts()
        .then(items => {
          if (!unmounted) {
            setItems(items);
            ref.current = true;
          }
        })
        .catch(() => setItems([]));
  };

  useEffect(
    (): (() => void) => (): void => {
      unmounted = true;
    },
    []
  );

  return (
    <Select2<number>
      className={className}
      onChange={_onChange}
      size={config?.size ?? "auto"}
      editable={true}
      search={search}
      value={value?.id ?? 0}
      onOpen={loadPosts}
    >
      {items.map(({ id, title }) => (
        <Item<number> value={id} key={id}>
          {trimTitle(title)}
        </Item>
      ))}
    </Select2>
  );
};

const getModel: GetModel<MValue<Post>> = get =>
  read({
    id: get("value"),
    title: get("title")
  });

InternalLink.getModel = getModel;
