import React, { JSX, useCallback, useEffect, useRef, useState } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { useConfig } from "visual/global/hooks";
import { blockThumbnailData } from "visual/utils/blocks";
import { preloadImage } from "visual/utils/image";
import { ThumbnailImage } from "./types";

const MAX_THUMBNAIL_WIDTH = 132;

export const BlockThumbnailImage = ({
  blockData: _blockData
}: ThumbnailImage): JSX.Element => {
  const isUnmounted = useRef(true);
  const config = useConfig();
  const { screenshot } = config.urls ?? {};

  const [data, setData] = useState({
    blockData: _blockData,
    imageFetched: false,
    showSpinner: true
  });

  const { blockData, imageFetched, showSpinner } = data;

  const preloadThumbnail = useCallback(
    (block) => {
      let canceled = false;
      const { url } = blockThumbnailData(block, screenshot);
      preloadImage(url).then(() => {
        if (isUnmounted.current && !canceled) {
          setData((prevData) => ({
            ...prevData,
            blockData: block,
            imageFetched: true,
            showSpinner: false
          }));
        }
      });

      return () => (canceled = true);
    },
    [isUnmounted, setData, screenshot]
  );

  useEffect(() => {
    if (isUnmounted.current) {
      preloadThumbnail(blockData);
    }

    return () => {
      isUnmounted.current = true;
    };
  }, [blockData, preloadThumbnail]);

  const { url, width, height } = blockThumbnailData(blockData, screenshot);
  const style = {
    width: MAX_THUMBNAIL_WIDTH,
    height: (MAX_THUMBNAIL_WIDTH * height) / width
  };
  const spinnerStyle = showSpinner ? {} : { display: "none" };

  return (
    <div className="brz-ed-option__block-thumbnail-image" style={style}>
      <div
        className="brz-ed-option__block-thumbnail-loading"
        style={spinnerStyle}
      >
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      </div>
      {imageFetched && <img className="brz-img" src={url} />}
    </div>
  );
};
