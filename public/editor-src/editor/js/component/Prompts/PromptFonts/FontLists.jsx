import React, { Component } from "react";
import _ from "underscore";
import { connect } from "react-redux";
import ScrollPane from "visual/component/ScrollPane";
import EditorIcon from "visual/component/EditorIcon";
import { fontTransform } from "visual/utils/fonts";
import { projectSelector, unDeletedFontSelector } from "visual/redux/selectors";
import { deleteFont } from "visual/redux/actions";
import { deleteFont as apiDeleteFont } from "./api";
import { fakeRequest } from "visual/component/Prompts/common/utils";

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
      await fakeRequest();
    }

    this.setState({
      loadingApp: ""
    });

    this.props.deleteFont({
      type,
      fonts: [font]
    });
  }

  renderFonts(fonts, type) {
    const { defaultFont } = this.props;
    const { loadingApp } = this.state;

    return fonts.reduce((acc, font) => {
      const { id, brizyId, title, family } = fontTransform[type](font);
      const isDefaultFault = defaultFont === id;
      const isLoading = loadingApp === brizyId;
      const component = (
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
                  this.handleDeleteFont(type, font);
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

      return isDefaultFault ? [...acc, component] : [component, ...acc];
    }, []);
  }

  render() {
    const { google = {}, upload = {}, blocks = {}, config } = this.props.fonts;

    return (
      <ScrollPane
        style={{ height: "100%" }}
        className="brz-ed-popup-integrations-apps__scroll-pane"
      >
        <div className="brz-ed-popup-fonts__lists brz-d-xs-flex brz-flex-xs-wrap">
          {upload.data && this.renderFonts(upload.data, "upload")}
          {google.data && this.renderFonts(google.data, "google")}
          {blocks.data && this.renderFonts(blocks.data, "blocks")}
          {this.renderFonts(config.data, "config")}
        </div>
      </ScrollPane>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FontLists);
