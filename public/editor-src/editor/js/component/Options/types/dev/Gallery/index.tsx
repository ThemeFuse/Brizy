import React, {
  ReactElement,
  Reducer,
  useCallback,
  useEffect,
  useReducer,
  useRef
} from "react";
import { BehaviorSubject, from, of } from "rxjs";
import {
  catchError,
  distinct,
  filter,
  map,
  mergeMap,
  withLatestFrom
} from "rxjs/operators";
import { Gallery as Control } from "visual/component/Controls/Gallery";
import { ToastNotification } from "visual/component/Notifications";
import * as Option from "visual/component/Options/Type";
import Config from "visual/global/Config";
import { AddImageData } from "visual/global/Config/types/configs/common";
import * as Arr from "visual/utils/array";
import { pipe } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import { reducer } from "./reducer";
import * as Actions from "./types/Actions";
import * as Image from "./types/Image";
import * as Item from "./types/Item";
import { allowedExtensions, toUploadData } from "./utils";

export type Value<I extends Image.Image> = Array<Image.Image | I>;
type Items = Item.Item<number>[];

export type Props<I extends Image.Image> = Option.Props<Value<I>> & {
  config?: {
    canDeleteLast?: boolean;
  };
};

export function Gallery<I extends Image.Image>({
  label,
  value,
  onChange,
  config
}: Props<I>): ReactElement<Props<I>> {
  const [items, dispatch] = useReducer<Reducer<Items, Actions.Actions>>(
    reducer,
    value.map((payload, i) => {
      // generating indexes from 1 because dnd-kit doesn't work with zero index element
      const idx = +i + 1;
      return Item.thumbnail(idx, payload);
    })
  );
  const items$ = useRef(new BehaviorSubject<Items>(items));
  const value$ = useRef(new BehaviorSubject<Value<I>>(value));
  const handleOnChange = useRef({ fn: onChange });
  handleOnChange.current.fn = onChange;

  const onRemove = useCallback(
    (payload) => dispatch(Actions.remove(payload)),
    []
  );

  const onSort = useCallback(
    pipe((from: number, to: number) => Actions.sort({ from, to }), dispatch),
    []
  );

  const onAdd = useCallback(() => {
    const config = Config.getAll();
    const { media } = config.api ?? {};

    if (media?.addMediaGallery) {
      const res = (data: Array<AddImageData>) => {
        pipe(Actions.add, dispatch)(data.map(toUploadData));
      };
      const rej = (t: string): void => {
        ToastNotification.error(t);
      };

      media.addMediaGallery.handler(res, rej, {
        acceptedExtensions: allowedExtensions
      });
    } else {
      ToastNotification.error(t("Missing addMediaGallery key in config.api"));
      pipe(Actions.add, dispatch)([]);
    }
  }, []);

  useEffect(() => value$.current.next(value), [value]);
  useEffect(() => items$.current.next(items), [items]);
  useEffect(() => {
    const onUpload$ = items$.current
      .pipe(
        map((s) => s.filter(Item.isLoading)),
        // from a stream of Observable<Item[]>, convert to Observable<Item>
        mergeMap((is) => from(is)),
        // Make sure that only new items pass
        distinct((i) => i.id),
        mergeMap(({ id, payload }) => {
          return from(payload).pipe(
            map((data) => Actions.fetchSuccess({ id, data })),
            catchError(() =>
              of(
                Actions.fetchError({
                  id,
                  message: "Unable to load image"
                })
              )
            )
          );
        })
      )
      .subscribe(dispatch);
    const onChange$ = items$.current
      .pipe(
        map((is) => is.filter(Item.isThumbnail).map((i) => i.payload)),
        withLatestFrom(value$.current),
        filter(([newValue, current]) => !Arr.eq(Image.eq, newValue, current)),
        map(([v]) => v)
      )
      .subscribe(handleOnChange.current.fn);
    return () => {
      onChange$.unsubscribe();
      onUpload$.unsubscribe();
    };
  }, []);

  const canDeleteLast = config?.canDeleteLast ?? true;
  const _onRemove = canDeleteLast || items.length > 1 ? onRemove : undefined;

  return (
    <>
      {label}
      <Control<number>
        onSort={onSort}
        onAdd={onAdd}
        items={items.map(Item.toGalleryItem)}
        onRemove={_onRemove}
      />
    </>
  );
}
