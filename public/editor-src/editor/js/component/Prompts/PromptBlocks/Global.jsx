import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import SearchInput from "./common/SearchInput";
import ThumbnailGrid from "./common/ThumbnailGrid";
import { assetUrl } from "visual/utils/asset";
import { blockThumbnailData } from "visual/utils/blocks";
import {
  fontSelector,
  globalBlocksAssembledSelector
} from "visual/redux/selectors";
import { deleteGlobalBlock } from "visual/redux/actions";
import {
  getUsedModelsFonts,
  getBlocksStylesFonts
} from "visual/utils/traverse";
import { t } from "visual/utils/i18n";
import { normalizeFonts } from "visual/utils/fonts";

class Global extends Component {
  static defaultProps = {
    showSearch: true,
    blocksFilter: globalBlock => globalBlock,
    onAddBlocks: _.noop,
    onClose: _.noop
  };

  state = {
    search: ""
  };

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
          <ScrollPane
            style={{
              overflow: "hidden",
              height: "100%"
            }}
            className="brz-ed-scroll--medium brz-ed-scroll--new-dark"
          >
            <ThumbnailGrid
              data={thumbnails}
              onThumbnailAdd={this.handleThumbnailAdd}
              onThumbnailRemove={this.handleThumbnailRemove}
            />
          </ScrollPane>
        </div>
      </Fragment>
    );
  }

  renderEmpty() {
    const { HeaderSlotLeft, showSearch } = this.props;

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
                  {t("Nothing here yet, make a global block first.")}
                </p>
                <img
                  src={`${assetUrl(
                    "editor/img/global_toolbar.gif"
                  )}?${Math.random()}`}
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

  render() {
    const { globalBlocks, blocksFilter } = this.props;
    const thumbnails = blocksFilter(Object.entries(globalBlocks)).reduce(
      (acc, [globalBlockId, block]) => {
        if (block.deleted) {
          return acc;
        }

        const { url, width, height } = blockThumbnailData(block);
        const thumbnailData = {
          id: globalBlockId,
          thumbnailSrc: url,
          thumbnailWidth: width,
          thumbnailHeight: height,
          showRemoveIcon: true,
          resolve: {
            type: "GlobalBlock",
            blockId: block.blockId,
            value: { globalBlockId }
          }
        };

        acc.push(thumbnailData);

        return acc;
      },
      []
    );
    return thumbnails.length > 0
      ? this.renderThumbnails(thumbnails)
      : this.renderEmpty();
  }
}

const mapStateToProps = state => ({
  globalBlocks: globalBlocksAssembledSelector(state),
  projectFonts: fontSelector(state)
});
const mapDispatchToProps = dispatch => ({
  dispatch
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Global);
