import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { Select2 } from "visual/component/Controls/Select2";
import { FromElementModel, OptionType } from "visual/component/Options/Type";
import * as Option from "visual/component/Options/Type";
import {
  WithClassName,
  WithConfig,
  WithSize
} from "visual/utils/options/attributes";
import { MValue } from "visual/utils/value";
import { Item } from "visual/component/Controls/MultiSelect/Item";
import { trimTitle } from "./utils";
import { getPosts } from "./store";
import { Post, read } from "./types/Post";
import { pipe } from "visual/utils/fp";

export type Props = Option.Props<MValue<Post>> &
  WithConfig<WithSize> &
  WithClassName;

export type Component = OptionType<MValue<Post>> & FC<Props>;

export const InternalLink: Component = ({
  className,
  onChange,
  value,
  config,
  label
}) => {
  // Use this flag in order to track if the element is mounted, as there is
  // no way to cancel promises
  let unmounted = false;
  const ref = useRef<boolean>();
  const [items, setItems] = useState<Post[]>(value ? [value] : []);
  const _onChange = useCallback(
    pipe(
      (v: number): Post | undefined => items.find(i => i.id === v),
      onChange
    ),
    [onChange, items]
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
    <>
      {label}
      <Select2<number>
        className={className}
        onChange={_onChange}
        size={config?.size ?? "auto"}
        editable={true}
        value={value?.id ?? 0}
        onOpen={loadPosts}
      >
        {items.map(({ id, title }) => (
          <Item<number> value={id} key={id}>
            {trimTitle(title)}
          </Item>
        ))}
      </Select2>
    </>
  );
};

const getModel: FromElementModel<MValue<Post>> = get =>
  read({
    id: get("value"),
    title: get("title")
  });

const getElementModel: Option.ToElementModel<MValue<Post>> = values => {
  return {
    value: values?.id,
    title: values?.title
  };
};

InternalLink.fromElementModel = getModel;

InternalLink.toElementModel = getElementModel;

InternalLink.defaultValue = {
  // @ts-expect-error: What default value(id) should be?
  id: null,
  title: ""
};
