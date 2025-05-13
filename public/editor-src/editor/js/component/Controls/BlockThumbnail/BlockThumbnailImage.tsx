import React, { JSX, useCallback, useEffect, useRef, useState } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { Block } from "visual/types/Block";
import { useConfig } from "visual/providers/ConfigProvider";
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
    (block: Block) => {
      let canceled = false;
      const { url } = blockThumbnailData({ block, screenshot, config });
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
    [isUnmounted, setData, screenshot, config]
  );

  useEffect(() => {
    if (isUnmounted.current) {
      preloadThumbnail(blockData);
    }

    return () => {
      isUnmounted.current = true;
    };
  }, [blockData, preloadThumbnail]);

  const { url, width, height } = blockThumbnailData({
    block: blockData,
    screenshot,
    config
  });
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
