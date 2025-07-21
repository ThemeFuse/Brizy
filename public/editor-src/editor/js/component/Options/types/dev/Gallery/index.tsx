import { Obj } from "@brizy/readers";
import classnames from "classnames";
import React, {
  ReactElement,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState
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
import {
  Gallery as Control,
  Props as ControlProps
} from "visual/component/Controls/Gallery";
import { ToastNotification } from "visual/component/Notifications";
import * as Option from "visual/component/Options/Type";
import { AddImageData } from "visual/global/Config/types/configs/common";
import { useConfig } from "visual/providers/ConfigProvider";
import * as Arr from "visual/utils/array";
import { pipe } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import {
  allowedExtensions,
  toInitialStructure,
  toUploadData,
  valueToItems
} from "visual/utils/options/Gallery/utils";
import { reducer } from "./reducer";
import * as Actions from "./types/Actions";
import * as Image from "./types/Image";
import * as Item from "./types/Item";

export type Value<I extends Image.Image> = Array<Image.Image | I>;
export type Items = Item.Item<number>[];

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
  const [isLoading, setIsLoading] = useState(false);
  const [items, dispatch] = useReducer<Reducer<Items, Actions.Actions>>(
    reducer,
    valueToItems(value)
  );

  useEffect(() => {
    if (
      items.length === value.length &&
      items.some((item) => Obj.isObject(item.payload) && !item.payload.id)
    ) {
      const newItems = valueToItems(value);

      if (
        newItems.every((item) => Obj.isObject(item.payload) && item.payload.id)
      ) {
        dispatch(Actions.set(newItems));
      }
    }
  }, [value, items]);

  const globalConfig = useConfig();
  const items$ = useRef(new BehaviorSubject<Items>(items));
  const value$ = useRef(new BehaviorSubject<Value<I>>(value));
  const handleOnChange = useRef({ fn: onChange });
  handleOnChange.current.fn = onChange;
  const media = globalConfig.api?.media;

  const onRemove = useCallback<Required<ControlProps<number>>["onRemove"]>(
    (payload) => dispatch(Actions.remove(payload)),
    []
  );

  const onSort = useCallback(
    (x0: number, x1: number) =>
      pipe((from: number, to: number) => Actions.sort({ from, to }), dispatch)(
        x0,
        x1
      ),
    []
  );

  const onAdd = useCallback(() => {
    if (media?.addMediaGallery) {
      setIsLoading(true);
      const res = (data: Array<AddImageData>) => {
        pipe(
          Actions.add,
          dispatch
        )(data.map((d) => toUploadData(d, globalConfig)));
        setIsLoading(false);
      };
      const rej = (t: string): void => {
        ToastNotification.error(t);
        setIsLoading(false);
      };

      media.addMediaGallery.handler(res, rej, {
        acceptedExtensions: allowedExtensions
      });
    } else {
      ToastNotification.error(t("Missing addMediaGallery key in config.api"));
      pipe(Actions.add, dispatch)([]);
    }
  }, [media, globalConfig]);

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
        map((is) =>
          is
            .filter(Item.isThumbnail)
            .map(({ id, payload }) => ({ id, payload }))
        ),
        withLatestFrom(value$.current),
        filter(
          ([newValue, current]) =>
            !Arr.eq(Image.eq, toInitialStructure(newValue), current)
        ),
        map(([v]) => toInitialStructure(v))
      )
      .subscribe(handleOnChange.current.fn);
    return () => {
      onChange$.unsubscribe();
      onUpload$.unsubscribe();
    };
  }, []);

  const canDeleteLast = config?.canDeleteLast ?? true;
  const _onRemove = canDeleteLast || items.length > 1 ? onRemove : undefined;
  const className = classnames({
    "brz-ed-control__gallery--fixed": items.length
  });

  const controlItems = useMemo(
    () => items.map((item) => Item.toGalleryItem(item, globalConfig)),
    [globalConfig, items]
  );

  return (
    <>
      {label}
      <Control<number>
        className={className}
        onSort={onSort}
        isLoading={isLoading}
        onAdd={onAdd}
        items={controlItems}
        onRemove={_onRemove}
      />
    </>
  );
}
