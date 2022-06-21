import React, { ReactElement } from "react";
import { imageUrl } from "visual/utils/image";
import { Thumbnail } from "visual/component/Controls/Gallery/components/Thumbnail";
import { Loading } from "visual/component/Controls/Gallery/components/Loading";
import { Error } from "visual/component/Controls/Gallery/components/Error";
import { Item as ItemType } from "../types/Item";

export interface Props<T> {
  item: ItemType<T>;
  onRemove: (id: T) => void;
}

export function Item<T>({ item, onRemove }: Props<T>): ReactElement {
  switch (item.__type) {
    case "thumbnail":
      return (
        <Thumbnail<T>
          id={item.id}
          src={imageUrl(item.payload.name, { iW: 42, iH: 42 }) ?? ""}
          onRemove={onRemove}
        />
      );
    case "loading":
      return <Loading<T> id={item.id} onRemove={onRemove} />;
    case "error":
      return (
        <Error<T> id={item.id} message={item.payload} onRemove={onRemove} />
      );
  }
}
