import { match } from "fp-utilities";
import React, { ReactElement, useCallback, useRef, useState } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import Config from "visual/global/Config";
import {
  getSavedBlockById,
  getSavedLayoutById,
  getSavedPopupById
} from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { blockIsPro } from "visual/utils/traverse/blockIsPro";
import { getContentType } from "visual/utils/url";
import {
  getExportBlocksUrls,
  isBlock,
  isLayout,
  isPopup
} from "../common/utils";
import { BlockTypes } from "../types";

export interface Props {
  id: string;
  type: BlockTypes;
}

const showNotification = (type: BlockTypes): void => {
  const message = match(
    [isBlock, (): string => t("Could not download Saved block")],
    [isLayout, (): string => t("Could not download Saved Layout")],
    [isPopup, (): string => t("Could not download Saved Popup")]
  );
  ToastNotification.error(message(type));
};

export const DownloadBlock = (props: Props): ReactElement => {
  const { id, type } = props;
  const [loading, setLoading] = useState(false);
  const rootEl = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<undefined | string>(undefined);

  const handleDownload = useCallback(async () => {
    setLoading(true);
    setSrc(undefined);
    const config = Config.getAll();
    const getBlock = match(
      [isBlock, () => getSavedBlockById(id, config)],
      [isLayout, () => getSavedLayoutById(id, config)],
      [isPopup, () => getSavedPopupById(id, config)]
    );

    try {
      const { data } = await getBlock(type);
      const node = rootEl.current;

      if (node) {
        const isPro = blockIsPro({ models: data, config });
        const url = getExportBlocksUrls(type, id, isPro);
        const contentType = await getContentType(url);

        if (
          contentType === "application/zip" ||
          contentType === "application/octet-stream"
        ) {
          setSrc(url);
        } else {
          showNotification(type);
        }

        setLoading(false);
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.error(`fail get ${type}`, e);
      }

      if (rootEl.current) {
        setLoading(false);
        showNotification(type);
      }
    }
  }, [id, type, rootEl]);

  const handleCheck = useCallback(() => {
    setSrc(undefined);
  }, []);

  return (
    <div
      ref={rootEl}
      title={t("Download this block")}
      className="brz-ed-popup-two-block-download"
      onClick={loading ? undefined : handleDownload}
    >
      {src && (
        <iframe src={src} hidden onLoad={handleCheck} title="download-block" />
      )}
      {loading ? (
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      ) : (
        <EditorIcon icon="nc-download-saved-block" />
      )}
    </div>
  );
};
