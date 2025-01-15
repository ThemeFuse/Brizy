import classnames from "classnames";
import React, { useMemo } from "react";
import type { Image } from "visual/component/Options/types/dev/Gallery/types/Image";
import { SizeType } from "visual/global/Config/types/configs/common";
import { useConfig } from "visual/global/hooks";
import { getImageUrl } from "visual/utils/image";
import { FCC } from "visual/utils/react/types";
import { read as readString } from "visual/utils/reader/string";

interface Props {
  className?: string;
  item: Image;
}

export const Slide: FCC<Props> = ({ className, item }) => {
  const _className = classnames("brz-bg-slideshow-item", className);
  const config = useConfig();

  const bgStyle = useMemo(() => {
    const { uid: _uid, fileName: _fileName } = item;

    const uid = readString(_uid) ?? "";
    const fileName = readString(_fileName) ?? "";

    const link = String(
      getImageUrl(
        {
          uid,
          fileName,
          sizeType: SizeType.original
        },
        config
      )
    );

    return {
      backgroundImage: `url(${link})`
    };
  }, [item, config]);

  return <div style={bgStyle} className={_className}></div>;
};
