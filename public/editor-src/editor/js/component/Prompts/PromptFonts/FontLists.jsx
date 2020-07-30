import React, { Component } from "react";
import _ from "underscore";
import { connect } from "react-redux";
import Scrollbars from "react-custom-scrollbars";
import EditorIcon from "visual/component/EditorIcon";
import { fontTransform } from "visual/utils/fonts";
import { projectSelector, unDeletedFontSelector } from "visual/redux/selectors";
import { deleteFont } from "visual/redux/actions";
import { deleteFont as apiDeleteFont } from "./api";
import { pendingRequest } from "visual/utils/api/editor";

const compareFont = (a, b) => {
  const familyA = a.family.toUpperCase();
  const familyB = b.family.toUpperCase();

  if (familyA < familyB) {
    return -1;
  }
  if (familyA > familyB) {
    return 1;
  }

  return 0;
};

class FontLists extends Component {
  static defaultProps = {
    fonts: {},
    defaultFont: "",
    deleteFont: _.noop,
    onClose: _.noop
  };

  state = {
    loadingApp: ""
  };

  async handleDeleteFont(type, font) {
    this.setState({
      loadingApp: font.brizyId
    });

    if (type === "upload") {
      await apiDeleteFont(font.id);
    } else {
      await pendingRequest();
    }

    this.setState({
      loadingApp: ""
    });

    this.props.deleteFont({
      type,
      fonts: [font]
    });
  }

  getSortedFonts(fonts) {
    return Object.entries(fonts)
      .map(([type, { data }]) =>
        data.map(font => ({ ...font, fontGroupType: type }))
      )
      .reduce((acc, curr) => {
        return acc.concat(curr);
      }, [])
      .sort(compareFont);
  }

  render() {
    const { defaultFont, fonts } = this.props;
    const { loadingApp } = this.state;

    return (
      <Scrollbars>
        <div className="brz-ed-popup-fonts__lists brz-d-xs-flex brz-flex-xs-wrap">
          {this.getSortedFonts(fonts).map(({ fontGroupType, ...font }) => {
            const { id, brizyId, title, family } = fontTransform[fontGroupType](
              font
            );
            const isDefaultFault = defaultFont === id;
            const isLoading = loadingApp === brizyId;

            return (
              <div key={brizyId} className="brz-ed-popup-fonts__item">
                <div
                  className="brz-ed-popup-fonts__item-logo"
                  style={{
                    fontFamily: family
                  }}
                >
                  Aa
                  {!isDefaultFault && !isLoading && (
                    <div
                      className="brz-ed-badge__delete brz-ed-popup-fonts__delete"
                      onClick={() => {
                        this.handleDeleteFont(fontGroupType, font);
                      }}
                    >
                      <EditorIcon icon="nc-trash" />
                    </div>
                  )}
                </div>
                <div className="brz-ed-popup-fonts__item-title">{title}</div>

                {isLoading && (
                  <span className="brz-span brz-ed-popup-integrations__app-icon">
                    <EditorIcon
                      icon="nc-circle-02"
                      className="brz-ed-animated--spin"
                    />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </Scrollbars>
    );
  }
}

const mapStateToProps = state => ({
  fonts: unDeletedFontSelector(state),
  defaultFont: projectSelector(state).data.font
});
const mapDispatchToProps = {
  deleteFont
};

export default connect(mapStateToProps, mapDispatchToProps)(FontLists);
