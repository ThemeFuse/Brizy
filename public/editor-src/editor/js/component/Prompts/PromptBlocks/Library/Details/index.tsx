import React, { useCallback, useEffect, useRef, useState } from "react";
import { useConfig } from "visual/providers/ConfigProvider";
import { placeholderBlockThumbnailUrl } from "visual/utils/blocks";
import * as Num from "visual/utils/math/number";
import { Footer } from "./Footer";
import { Left } from "./Left";
import { Props, State } from "./type";
import { detailsBlockClassName } from "./utils";

export const Details = (props: Props) => {
  const [state, setState] = useState<State>({
    thumbnailHeight: 0,
    transition: 0,
    previewPointer: "none",
    replaceStyle: false,
    loading: false
  });

  const config = useConfig();

  const thumbnailDetails = useRef<HTMLDivElement>(null);
  const timeoutIdRef = useRef<number | undefined>();

  const handleUpdateThumbnail = useCallback((): void => {
    setState((state) =>
      thumbnailDetails.current
        ? {
            ...state,
            thumbnailHeight: thumbnailDetails.current.clientHeight
          }
        : state
    );
  }, []);

  const onImport = () => {
    const { data, onAddBlocks } = props;
    const { replaceStyle } = state;

    setState((state) => ({
      ...state,
      loading: true
    }));
    onAddBlocks(data, replaceStyle);
  };

  const onReplaceStyling = (): void => {
    setState((state) => ({
      ...state,
      replaceStyle: !state.replaceStyle
    }));
  };

  useEffect(() => {
    handleUpdateThumbnail();
    window.addEventListener("resize", handleUpdateThumbnail);

    const timeId = setTimeout(() => {
      setState((prevState) => ({ ...prevState, previewPointer: "auto" }));
    }, 200);

    timeoutIdRef.current = Num.read(timeId);

    return () => {
      window.removeEventListener("resize", handleUpdateThumbnail);
      clearTimeout(timeoutIdRef.current);
    };
  }, [handleUpdateThumbnail]);

  const { data, onBack } = props;

  const { title, thumbnailSrc, globalStyles } = data;

  const { thumbnailHeight, previewPointer, replaceStyle, loading } = state;

  const activePageSrc = thumbnailSrc ?? placeholderBlockThumbnailUrl(config);

  return (
    <>
      <div className={detailsBlockClassName}>
        <Left
          onBack={onBack}
          previewPointer={previewPointer}
          activePageSrc={activePageSrc}
          thumbnailHeight={thumbnailHeight}
          ref={thumbnailDetails}
          title={title}
        />

        <Footer
          onReplaceStyling={onReplaceStyling}
          onImport={onImport}
          loading={loading}
          replaceStyle={replaceStyle}
          hasGlobalStyle={!!globalStyles?.id}
        />
      </div>
    </>
  );
};
