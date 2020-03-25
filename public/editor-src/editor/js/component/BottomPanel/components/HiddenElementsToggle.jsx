import React from "react";
import { connect } from "react-redux";
import EditorIcon from "visual/component/EditorIcon";
import { showHiddenElementsSelector } from "visual/redux/selectors";
import { updateUI } from "visual/redux/actions2";
import { t } from "visual/utils/i18n";

function HiddenElementsToggle({ showHiddenElements, dispatch }) {
  const icon = showHiddenElements ? "nc-eye-17" : "nc-eye-ban-18";
  const title = showHiddenElements
    ? t("Hide Hidden Elements")
    : t("Show Hidden Elements");

  return (
    <li
      className="brz-li brz-ed-fixed-bottom-panel__item brz-ed-fixed-bottom-panel__hidden_elements"
      title={title}
      onClick={() =>
        dispatch(updateUI("showHiddenElements", !showHiddenElements))
      }
    >
      <EditorIcon icon={icon} />
    </li>
  );
}

const mapStateToProps = state => ({
  showHiddenElements: showHiddenElementsSelector(state)
});

export default connect(mapStateToProps)(HiddenElementsToggle);
