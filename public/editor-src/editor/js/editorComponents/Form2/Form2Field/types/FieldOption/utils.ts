import { connect } from "react-redux";
import { deviceModeSelector } from "visual/redux/selectors";
import type { ReduxState } from "visual/redux/types";
import type { Link } from "visual/utils/models/link";
import type { ConvertedLinkData } from "./type";

export const convertLinkData = (linkData: Link): ConvertedLinkData => {
  const { href, type, target, rel, slide } = linkData;

  return linkData.href
    ? {
        isCheckboxWithLink: linkData,
        typeCheckbox: type,
        hrefCheckbox: href,
        targetCheckbox: target,
        relCheckbox: rel,
        slideCheckbox: slide
      }
    : {};
};

const mapState = (state: ReduxState) => ({
  deviceMode: deviceModeSelector(state)
});

export const Form2OptionConnector = connect(mapState);
