import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Root } from "visual/component/Root";
import Config from "visual/global/Config";
import EditorGlobal from "visual/global/Editor";
import { updateBlocks } from "visual/redux/actions2";
import { pageBlocksSelector, stateSelector } from "visual/redux/selectors";
import { areStatesEqual } from "../utils";
import { t } from "visual/utils/i18n";

const Story = (): JSX.Element => {
  const state = useSelector(stateSelector, areStatesEqual);
  const items = useSelector(pageBlocksSelector);
  const dispatch = useDispatch();

  const handlePageChange = useCallback(
    ({ items: blocks }, meta) => {
      dispatch(updateBlocks({ blocks, meta }));
    },
    [dispatch]
  );

  const { PageStory } = EditorGlobal.getComponents();
  const pagePreview = useMemo(() => {
    const { pagePreview } = Config.getAll().urls;
    return pagePreview;
  }, []);

  if (!PageStory) {
    return <div>{t("Missing PageStory Component")}</div>;
  }

  return (
    <>
      {items.length > 0 && (
        <iframe id="brz-ed-home-page" src={pagePreview} title="story" />
      )}
      <Root type="story">
        {/* @ts-expect-error: Missing EditorComponent props */}
        <PageStory
          dbValue={{ items }}
          reduxState={state}
          reduxDispatch={dispatch}
          onChange={handlePageChange}
        />
      </Root>
    </>
  );
};

export default Story;
