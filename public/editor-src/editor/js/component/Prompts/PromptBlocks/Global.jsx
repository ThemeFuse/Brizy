import React, { Component, Fragment } from "react";
import T from "prop-types";
import { connect } from "react-redux";
import _ from "underscore";
import Scrollbars from "react-custom-scrollbars";
import SearchInput from "./common/SearchInput";
import ThumbnailGrid from "./common/ThumbnailGrid";
import Tooltip from "visual/component/Controls/Tooltip";
import { assetUrl } from "visual/utils/asset";
import { blockThumbnailData } from "visual/utils/blocks";
import { IS_GLOBAL_POPUP } from "visual/utils/models";
import {
  globalBlocksAssembledSelector,
  globalBlocksInPageSelector,
  fontSelector
} from "visual/redux/selectors";
import { deleteGlobalBlock } from "visual/redux/actions2";
import {
  getBlocksStylesFonts,
  getUsedModelsFonts
} from "visual/utils/traverse";
import { t } from "visual/utils/i18n";
import { normalizeFonts } from "visual/utils/fonts";

class Global extends Component {
  static defaultProps = {
    type: "normal",
    showSearch: true,
    onAddBlocks: _.noop,
    onClose: _.noop,
    HeaderSlotLeft: _.noop
  };

  static propTypes = {
    type: T.oneOf(["normal", "popup"]),
    showSearch: T.bool,
    showSidebar: T.bool,
    onAddBlocks: T.func,
    onClose: T.func,
    HeaderSlotLeft: T.func
  };

  state = {
    search: ""
  };

  getBlocks() {
    const { type, globalBlocks } = this.props;

    return Object.values(globalBlocks).filter(
      ({ data, meta = {} }) => !data.deleted && meta.type === type
    );
  }

  handleThumbnailAdd = async thumbnailData => {
    const { globalBlocks, projectFonts, onAddBlocks, onClose } = this.props;
    const { resolve } = thumbnailData;
    const fontsDiff = getBlocksStylesFonts(
      getUsedModelsFonts({ models: resolve, globalBlocks }),
      projectFonts
    );
    const fonts = await normalizeFonts(fontsDiff);

    onAddBlocks({
      block: resolve,
      fonts
    });
    onClose();
  };

  handleThumbnailRemove = thumbnailData => {
    const { dispatch } = this.props;
    const { id } = thumbnailData;

    dispatch(deleteGlobalBlock({ id }));
  };

  renderThumbnails(thumbnails) {
    const { HeaderSlotLeft, showSearch } = this.props;

    return (
      <Fragment>
        {showSearch && (
          <HeaderSlotLeft>
            <SearchInput
              className="brz-ed-popup-two-header__search"
              value={this.state.search}
              onChange={search => this.setState({ search })}
            />
          </HeaderSlotLeft>
        )}
        <div className="brz-ed-popup-two-body__content">
          <Scrollbars>
            <ThumbnailGrid
              data={thumbnails}
              onThumbnailAdd={this.handleThumbnailAdd}
              onThumbnailRemove={this.handleThumbnailRemove}
            />
          </Scrollbars>
        </div>
      </Fragment>
    );
  }

  renderEmpty() {
    const { HeaderSlotLeft, showSearch, type } = this.props;
    let gifUrl;
    let message = t("Nothing here yet, make a global block first.");

    switch (type) {
      case "popup": {
        gifUrl = IS_GLOBAL_POPUP
          ? "editor/img/global_condition_popups_toolbar.gif"
          : "editor/img/global_popups_toolbar.gif";
        message = t("Nothing here yet, make a global popup first.");
        break;
      }

      default: {
        gifUrl = "editor/img/global_toolbar.gif";
      }
    }

    return (
      <Fragment>
        {showSearch && (
          <HeaderSlotLeft>
            <SearchInput
              className="brz-ed-popup-two-header__search"
              value={this.state.search}
              onChange={value => this.setState({ search: value })}
            />
          </HeaderSlotLeft>
        )}
        <div className="brz-ed-popup-two-body__content">
          <div className="brz-ed-popup-two-blocks__grid brz-ed-popup-two-blocks__grid-clear">
            {this.state.search !== "" ? (
              <p className="brz-ed-popup-two-blocks__grid-clear-text">
                {t("Nothing here, please refine your search.")}
              </p>
            ) : (
              <Fragment>
                <p className="brz-ed-popup-two-blocks__grid-clear-text">
                  {message}
                </p>
                <img
                  src={`${assetUrl(gifUrl)}?${Math.random()}`}
                  className="brz-ed-popup-two-blocks__grid-clear-image-global"
                  alt="Global"
                />
              </Fragment>
            )}
          </div>
        </div>
      </Fragment>
    );
  }

  renderProInfo() {
    return (
      <div className="brz-ed-tooltip-content__pro">
        <p className="brz-p brz-ed-tooltip-content__pro-title">
          {t("You can't add it again")}
        </p>
      </div>
    );
  }

  renderThumbnailTooltip(content) {
    return (
      <Tooltip
        className="brz-ed-global-tooltip"
        overlayClassName="brz-ed-tooltip--delay-1"
        size="small"
        offset="5"
        openOnClick={false}
        overlay={this.renderProInfo()}
      >
        {content}
      </Tooltip>
    );
  }

  render() {
    const { globalBlocks, globalBlocksInPage } = this.props;
    const blocks = this.getBlocks();

    if (blocks.length === 0) {
      return this.renderEmpty();
    }

    const thumbnails = blocks.map(block => {
      const { url, width, height } = blockThumbnailData(block.data);
      const { _id } = block.data.value;
      const { data } = globalBlocks[_id];

      const inactive =
        IS_GLOBAL_POPUP ||
        data.type === "SectionPopup" ||
        data.type === "SectionPopup2"
          ? false
          : globalBlocksInPage[_id];

      return {
        id: _id,
        thumbnailSrc: url,
        thumbnailWidth: width,
        thumbnailHeight: height,
        showRemoveIcon: true,
        renderWrapper: content =>
          inactive ? this.renderThumbnailTooltip(content) : content,
        inactive,
        resolve: {
          type: "GlobalBlock",
          value: { _id }
        }
      };
    }, []);

    return this.renderThumbnails(thumbnails);
  }
}

const mapStateToProps = state => ({
  globalBlocks: globalBlocksAssembledSelector(state),
  globalBlocksInPage: globalBlocksInPageSelector(state),
  projectFonts: fontSelector(state)
});
const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Global);
