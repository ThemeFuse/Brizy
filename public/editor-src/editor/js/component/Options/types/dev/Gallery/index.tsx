import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";
import { replaceAt } from "timm";
import * as Arr from "visual/utils/array";
import { t } from "visual/utils/i18n";
import { UploadData } from "visual/utils/image/uploadImage";
import { prop } from "visual/utils/object/get";
import * as Option from "visual/component/Options/Type";
import { OptionType } from "visual/component/Options/Type";
import { Gallery as Control } from "visual/component/Controls/Gallery";
import { fromElementModel, toElementModel, defaultValue } from "./converters";
import { eq, Image } from "./types/Image";
import * as Item from "./types/Item";
import { allowedExtensions, maxId } from "./utils";

type Value = Image[];

export type Props = Option.Props<Value>;

export const Gallery: OptionType<Value> & FC<Props> = ({
  label,
  value,
  onChange
}): ReactElement => {
  const [items, setItems] = useState<Item.Item<number>[]>(
    value.map((payload, id) => Item.thumbnail(id, payload))
  );
  const onAdd = useCallback(
    (ps: Promise<UploadData>[]) => {
      const max = maxId(items);
      setItems([...items, ...ps.map((p, i) => Item.loading(i + max + 1, p))]);
    },
    [items, setItems]
  );
  const onRemove = useCallback(
    (id: number) => setItems(items.filter(i => i.id !== id)),
    [items, setItems]
  );
  const onSuccess = useCallback(
    (data: UploadData, id: number): void => {
      const index = Arr.findIndex(i => i.id === id, items);
      if (index !== undefined) {
        setItems(
          replaceAt(items, index, Item.thumbnail(id, { name: data.name }))
        );
      }
    },
    [items, setItems]
  );
  const onError = useCallback(
    (e: unknown, id: number): void => {
      const error = typeof e === "string" ? e : t("Unable to upload");
      const index = Arr.findIndex(i => i.id === id, items);
      if (index !== undefined) {
        setItems(replaceAt(items, index, Item.error(id, error)));
      }
    },
    [items, setItems]
  );
  const onSort = useCallback<(from: number, to: number) => void>(
    (from, to) => setItems(Arr.move(from, to, items)),
    [items, setItems]
  );

  useEffect(() => {
    const thumbs = items.filter(Item.isThumbnail).map(prop("payload"));
    if (!Arr.eq(eq, value, thumbs)) {
      const max = maxId(items);
      setItems([
        ...value.map(
          (v, i) => Item.thumbnail(i + max + 1, v),
          ...items.filter(i => !Item.isThumbnail(i))
        )
      ]);
    }
  }, [value, setItems]);

  useEffect(() => {
    const thumbs = items.filter(Item.isThumbnail).map(prop("payload"));
    if (!Arr.eq(eq, value, thumbs)) {
      onChange(thumbs);
    }
  }, [items, onChange]);

  useEffect(() => {
    let flag = true;
    items.filter(Item.isLoading).map(p =>
      p.payload
        .then(r => {
          flag && onSuccess(r, p.id);
          return r;
        })
        .catch(e => {
          flag && onError(e, p.id);
          throw e;
        })
    );

    return (): void => {
      flag = false;
    };
  }, [items, onError, onSuccess]);

  const itemsList = useMemo(() => items.map(Item.toGalleryItem), [items]);

  return (
    <>
      {label}
      <Control
        allowedExtensions={allowedExtensions}
        onSort={onSort}
        onAdd={onAdd}
        items={itemsList}
        onRemove={onRemove}
      />
    </>
  );
};

Gallery.defaultValue = defaultValue;
Gallery.fromElementModel = fromElementModel;
Gallery.toElementModel = toElementModel;
