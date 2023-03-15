import classNames from "classnames";
import React, { ChangeEvent, FC, useCallback } from "react";
import { map } from "visual/utils/array";
import { mPipe } from "visual/utils/fp";
import { uploadImagePromise } from "visual/utils/image/uploadImage";
import { Props } from "./types/Props";

export * from "./types/Props";

export const ImageUpload: FC<Props> = ({
  allowedExtensions,
  children,
  onChange,
  className
}) => {
  const upload = useCallback(
    (image: File) => uploadImagePromise(allowedExtensions, image),
    [allowedExtensions]
  );
  const _onChange = useCallback(
    mPipe(
      (e: ChangeEvent<HTMLInputElement>) => e.target?.files,
      Array.from,
      map(upload),
      onChange
    ),
    [onChange, upload]
  );

  return (
    <label className={classNames("brz-ed-control__imageUpload", className)}>
      {children}
      <input type={"file"} multiple onChange={_onChange} hidden />
    </label>
  );
};
