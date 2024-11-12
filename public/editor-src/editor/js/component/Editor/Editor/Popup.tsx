import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Root } from "visual/component/Root";
import Config from "visual/global/Config";
import EditorGlobal from "visual/global/Editor";
import { updateBlocks } from "visual/redux/actions2";
import { pageBlocksSelector, stateSelector } from "visual/redux/selectors";
import { areStatesEqual } from "../utils";
import { t } from "visual/utils/i18n";

const Popup = (): JSX.Element => {
  const state = useSelector(stateSelector, areStatesEqual);
  const items = useSelector(pageBlocksSelector);
  const dispatch = useDispatch();

  const handlePageChange = useCallback(
    ({ items: blocks }, meta) => {
      dispatch(updateBlocks({ blocks, meta }));
    },
    [dispatch]
  );

  useEffect(() => {
    document.body.classList.add("brz-ow-hidden", "brz-height--100vh");
  }, []);

  const backgroundPreviewUrl = useMemo(() => {
    const config = Config.getAll();
    const { backgroundPreviewUrl } = config.ui?.popupSettings ?? {};
    return backgroundPreviewUrl;
  }, []);

  const { PagePopup } = EditorGlobal.getComponents();

  if (!PagePopup) {
    return <div>{t("Missing PagePopup Component")}</div>;
  }

  return (
    <>
      {items.length > 0 && backgroundPreviewUrl && (
        <iframe
          id="brz-ed-home-page"
          src={backgroundPreviewUrl}
          title="popup"
        />
      )}
      <Root type="popup">
        {/* @ts-expect-error: Missing EditorComponent props */}
        <PagePopup
          dbValue={{ items }}
          reduxState={state}
          reduxDispatch={dispatch}
          onChange={handlePageChange}
        />
      </Root>
    </>
  );
};

export default Popup;
