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
  savedBlocksAssembledSelector
} from "visual/redux/selectors";
import { deleteSavedBlock } from "visual/redux/actions";
import {
  getUsedModelsFonts,
  getBlocksStylesFonts
} from "visual/utils/traverse";
import { t } from "visual/utils/i18n";
import { normalizeFonts } from "visual/utils/fonts";

class Saved extends Component {
  static defaultProps = {
    showSearch: true,
    blocksFilter: savedBlock => savedBlock,
    onAddBlocks: _.noop,
    onClose: _.noop
  };

  state = {
    search: ""
  };

  handleThumbnailAdd = async thumbnailData => {
    const { projectFonts, onAddBlocks, onClose } = this.props;
    const { resolve } = thumbnailData;
    const fontsDiff = getBlocksStylesFonts(
      getUsedModelsFonts({ models: resolve }),
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
    this.props.dispatch(deleteSavedBlock({ id: thumbnailData.id }));
  };

  renderThumbnails(data) {
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
          <ScrollPane
            style={{
              overflow: "hidden",
              height: "100%"
            }}
            className="brz-ed-scroll--medium brz-ed-scroll--new-dark"
          >
            <ThumbnailGrid
              data={data}
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
              onChange={search => this.setState({ search })}
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
                  {t("Nothing here yet, save a block first.")}
                </p>
                <img
                  src={`${assetUrl(
                    "editor/img/save_toolbar.gif"
                  )}?${Math.random()}`}
                  className="brz-ed-popup-two-blocks__grid-clear-image-saved"
                  alt="Saved"
                />
              </Fragment>
            )}
          </div>
        </div>
      </Fragment>
    );
  }

  render() {
    const { savedBlocks, blocksFilter } = this.props;
    const thumbnails = blocksFilter(Object.entries(savedBlocks)).reduce(
      (acc, [savedBlockId, block]) => {
        const { url, width, height } = blockThumbnailData(block);
        const thumbnailData = {
          id: savedBlockId,
          thumbnailSrc: url,
          thumbnailWidth: width,
          thumbnailHeight: height,
          showRemoveIcon: true,
          resolve: block
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
  savedBlocks: savedBlocksAssembledSelector(state),
  projectFonts: fontSelector(state)
});

export default connect(mapStateToProps)(Saved);
