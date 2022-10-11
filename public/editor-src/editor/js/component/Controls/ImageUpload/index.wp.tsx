import classNames from "classnames";
import React, { FC, useCallback, useEffect, useRef } from "react";
import { getImageUid } from "visual/utils/api/index.wp";
import { UploadData } from "visual/utils/image/uploadImage";
import { Props, SelectionData } from "./types/Props";

export * from "./types/Props";

const uploadImage = ({
  id,
  fileName
}: {
  id: number;
  fileName: string;
}): Promise<UploadData> =>
  // @ts-expect-error TS2739
  getImageUid(id).then(({ uid }: Attachment) => ({ name: uid, fileName }));

export const ImageUpload: FC<Props> = ({ children, className, onChange }) => {
  // eslint-disable-next-line
  const uploaderRef = useRef<any>();
  const open = useCallback(() => uploaderRef?.current?.open(), []);

  useEffect(() => {
    let flag = true;
    const wp = global.wp || global.parent.wp;

    uploaderRef.current = wp.media({
      library: {
        type: "image"
      },
      states: new wp.media.controller.Library({
        library: wp.media.query({ type: "image" }),
        multiple: true,
        title: "Upload media",
        filterable: "uploaded",
        priority: 20
      })
    });

    const html = document.querySelector("html");

    uploaderRef.current?.on("select", () => {
      const ids: Array<{ id: number; fileName: string }> = uploaderRef.current
        .state()
        .get("selection")
        .models.map((i: SelectionData<number>) => ({
          id: i.id,
          fileName: i.attributes.filename
        }));

      flag && onChange(ids.map(uploadImage));
    });

    uploaderRef.current?.on("close", () =>
      html?.classList.add("brz-ow-hidden")
    );
    uploaderRef.current?.on("close", () =>
      html?.classList.remove("brz-ow-hidden")
    );

    return (): void => {
      flag = false;
    };
  }, [onChange]);

  return (
    <label
      onClick={open}
      className={classNames("brz-ed-control__imageUpload", className)}
    >
      {children}
    </label>
  );
};
