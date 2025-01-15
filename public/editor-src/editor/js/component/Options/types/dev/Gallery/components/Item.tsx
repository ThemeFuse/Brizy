import React, { ReactElement } from "react";
import { Error } from "visual/component/Controls/Gallery/components/Error";
import { Loading } from "visual/component/Controls/Gallery/components/Loading";
import { Thumbnail } from "visual/component/Controls/Gallery/components/Thumbnail";
import { SizeType } from "visual/global/Config/types/configs/common";
import { useConfig } from "visual/global/hooks";
import { getImageUrl } from "visual/utils/image";
import { Item as ItemType } from "../types/Item";

export interface Props<T> {
  item: ItemType<T>;
  onRemove: (id: T) => void;
}

export function Item<T>({ item, onRemove }: Props<T>): ReactElement {
  const config = useConfig();

  switch (item.__type) {
    case "thumbnail": {
      const src =
        getImageUrl(
          {
            uid: item.payload.uid,
            fileName: item.payload.fileName ?? "",
            sizeType: SizeType.custom,
            crop: { iW: 42, iH: 42 }
          },
          config
        ) ?? "";
      return <Thumbnail<T> id={item.id} src={src} onRemove={onRemove} />;
    }
    case "loading":
      return <Loading<T> id={item.id} onRemove={onRemove} />;
    case "error":
      return (
        <Error<T> id={item.id} message={item.payload} onRemove={onRemove} />
      );
  }
}
