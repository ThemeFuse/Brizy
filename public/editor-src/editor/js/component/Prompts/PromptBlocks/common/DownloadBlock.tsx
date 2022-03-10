import React, { useCallback, useRef, useState, ReactElement } from "react";
import { match } from "fp-utilities";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import { t } from "visual/utils/i18n";
import { BlockTypes } from "../types";
import {
  getExportBlocksUrls,
  isBlock,
  isLayout,
  isPopup
} from "../common/utils";
import { getSavedBlockById, getSavedLayoutById } from "visual/utils/api";
import { SavedBlock, SavedLayout } from "visual/types";
import { blockIsPro } from "visual/utils/traverse/blockIsPro";

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
  ToastNotification.error(message(type), {
    toastContainer: window.parent.document.body
  });
};

export const DownloadBlock = (props: Props): ReactElement => {
  const { id, type } = props;
  const [loading, setLoading] = useState(false);
  const rootEl = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<undefined | string>(undefined);

  const handleDownload = useCallback(async () => {
    setLoading(true);
    setSrc(undefined);

    const getBlock = match(
      [isBlock, (): Promise<SavedBlock> => getSavedBlockById(id)],
      [isLayout, (): Promise<SavedLayout> => getSavedLayoutById(id)],
      [isPopup, (): Promise<SavedBlock> => getSavedBlockById(id)]
    );

    try {
      const { data } = await getBlock(type);
      const node = rootEl.current;

      if (node) {
        const isPro = blockIsPro({ models: data });
        const url = getExportBlocksUrls(type, id, isPro);
        setSrc(url);
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
    showNotification(type);
    setSrc(undefined);
  }, [type, src]);

  return (
    <div
      ref={rootEl}
      title={t("Download this block")}
      className="brz-ed-popup-two-block-download"
      onClick={loading ? undefined : handleDownload}
    >
      {src && <iframe src={src} hidden onLoad={handleCheck} />}
      {loading ? (
        <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
      ) : (
        <EditorIcon icon="nc-down" />
      )}
    </div>
  );
};
