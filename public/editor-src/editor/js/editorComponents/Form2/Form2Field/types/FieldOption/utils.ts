import { Link } from "visual/utils/models/link";
import { ConvertedLinkData } from "./type";
import { ReduxState } from "visual/redux/types";
import { connect } from "react-redux";
import { deviceModeSelector } from "visual/redux/selectors";

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
