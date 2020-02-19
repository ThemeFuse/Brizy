import React from "react";
import produce from "immer";
import _ from "underscore";
import classnames from "classnames";
import { connect } from "react-redux";
import ScrollPane from "visual/component/ScrollPane";
import EditorIcon from "visual/component/EditorIcon";
import { blockThumbnailData } from "visual/utils/blocks";
import { preloadImage } from "visual/utils/image";
import {
  pageBlocksSelector,
  pageBlocksAssembledSelector,
  globalBlocksAssembled2Selector
} from "visual/redux/selectors";
import { updateBlocks } from "visual/redux/actions";
import { updateGlobalBlock } from "visual/redux/actions2";
import { t } from "visual/utils/i18n";

const MAX_THUMBNAIL_WIDTH = 132;

class BlockThumbnail extends React.Component {
  static defaultProps = {
    label: "",
    className: "",
    attr: {},
    helper: false,
    helperContent: "",
    display: "inline",
    value: ""
  };

  anchorInputRefs = [];

  componentWillUnmount() {
    this.anchorInputRefs = null;
  }

  handleThumbnailClick = id => {
    if (this.props.value === id) {
      this.props.onChange("");
    } else {
      this.props.onChange(id);
    }
  };

  handleInputChange = _.debounce((text, id) => {
    const { pageBlocks: blocks, globalBlocks, dispatch } = this.props;
    const encodedText = encodeURIComponent(text);

    let anchorName = encodedText;
    if (anchorName !== "") {
      // suppose we have the following blockAnchorNames ["contact", "about-us"]
      // if we add "contact" once again we must detect that it's already used
      // and transform it to "contact-2"
      const blockAnchorNames = blocks
        .filter(block => block.value._id !== id)
        .map(block => {
          if (block.type === "GlobalBlock") {
            block = globalBlocks[block.value.globalBlockId].data;
          }

          return block.value.anchorName;
        });
      let foundDuplicateAnchorName = false;
      let retriesCount = 0;
      do {
        foundDuplicateAnchorName = false;

        for (let blockAnchorName of blockAnchorNames) {
          if (anchorName === blockAnchorName) {
            foundDuplicateAnchorName = true;
            anchorName = encodedText + "-" + (++retriesCount + 1); // start at 2
            break;
          }
        }
      } while (foundDuplicateAnchorName);
    }

    const blockToUpdate = blocks.find(({ type, value }) => {
      if (type === "GlobalBlock") {
        return globalBlocks[value.globalBlockId].data.value._id === id;
      }

      return value._id === id;
    });
    if (blockToUpdate.type !== "GlobalBlock") {
      const updatedBlocks = blocks.map(block => {
        return block.value._id === id
          ? {
              ...block,
              value: {
                ...block.value,
                anchorName
              }
            }
          : block;
      });

      dispatch(updateBlocks({ blocks: updatedBlocks }));
    } else {
      const globalBlockId = blockToUpdate.value.globalBlockId;
      const globalBlock = produce(globalBlocks[globalBlockId], draft => {
        draft.data.value.anchorName = anchorName;
      });

      dispatch(updateGlobalBlock(globalBlock));
    }

    this.anchorInputRefs[id].setValue(anchorName);
  }, 1000);

  renderLabel() {
    const { label, helper: _helper, helperContent } = this.props;
    const helper = _helper ? (
      <div className="brz-ed-option__helper">
        <EditorIcon icon="nc-alert-circle-que" />
        <div
          className="brz-ed-option__helper__content"
          dangerouslySetInnerHTML={{ __html: helperContent }}
        />
      </div>
    ) : null;

    return (
      <div className="brz-ed-option__label">
        {label}
        {helper}
      </div>
    );
  }

  renderThumbnails() {
    const { value, pageBlocksAssembled, globalBlocks } = this.props;
    const blocks = pageBlocksAssembled.filter(
      block => block.value._blockVisibility !== "unlisted"
    );

    return blocks.map(block => {
      if (block.type === "GlobalBlock") {
        block = globalBlocks[block.value.globalBlockId].data;
      }

      const { _id, anchorName } = block.value;
      const className = classnames("brz-ed-option__block-thumbnail-item", {
        active: _id === value
      });
      const inputValue = anchorName ? decodeURIComponent(anchorName) : "";

      return (
        <div
          key={_id}
          className={className}
          onClick={() => this.handleThumbnailClick(_id)}
        >
          <BlockThumbnailImage blockData={block} />
          <AnchorInput
            ref={el => {
              // when the component unmounts this function is also called
              // with el being null and this.anchorInputRefs is also null from componentWillUnmount
              // thus causing property of null error if not guarded
              if (el) {
                this.anchorInputRefs[_id] = el;
              }
            }}
            id={_id}
            value={inputValue}
            onChange={value => this.handleInputChange(value, _id)}
          />
        </div>
      );
    });
  }

  render() {
    const { className: _className, attr, label, helper, display } = this.props;
    const className = classnames(
      "brz-ed-option__block-thumbnail",
      `brz-ed-option__${display}`,
      _className,
      attr.className
    );

    return (
      <div {...attr} className={className}>
        {label || helper ? this.renderLabel() : null}
        <ScrollPane
          style={{ height: "100%", overflow: "hidden" }}
          className="brz-ed-scroll-pane brz-ed-scroll--small brz-ed-scroll--darker"
        >
          {this.renderThumbnails()}
        </ScrollPane>
      </div>
    );
  }
}

class BlockThumbnailImage extends React.Component {
  state = {
    blockData: this.props.blockData,
    imageFetched: false,
    showSpinner: true
  };

  componentDidMount() {
    this.mounted = true;
    this.preloadThumbnail(this.state.blockData);
  }

  preloadThumbnail(blockData) {
    let canceled = false;
    const { url } = blockThumbnailData(blockData);

    preloadImage(url).then(() => {
      if (this.mounted && !canceled) {
        this.setState({
          imageFetched: true,
          showSpinner: false,
          blockData: blockData
        });
      }
    });

    return () => (canceled = true);
  }

  render() {
    const { blockData, imageFetched, showSpinner } = this.state;
    const { url, width, height } = blockThumbnailData(blockData);
    const style = {
      width: MAX_THUMBNAIL_WIDTH,
      height: (MAX_THUMBNAIL_WIDTH * height) / width
    };
    const spinnerStyle = showSpinner ? {} : { display: "none" };

    return (
      <div className="brz-ed-option__block-thumbnail-image" style={style}>
        <div
          className="brz-ed-option__block-thumbnail-loading"
          style={spinnerStyle}
        >
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        </div>
        {imageFetched && <img className="brz-img" src={url} />}
      </div>
    );
  }
}

class AnchorInput extends React.Component {
  state = {
    inputValue: this.props.value
  };

  setValue(value) {
    if (this.state.inputValue !== value) {
      this.setState({ inputValue: value });
    }
  }

  handleContainerClick = e => {
    e.stopPropagation();
  };

  handleInputChange = e => {
    this.setState(
      {
        inputValue: e.target.value
      },
      () => {
        this.props.onChange(this.state.inputValue);
      }
    );
  };

  render() {
    const { id } = this.props;
    const inputID = `anchor-${id}`;

    return (
      <div
        className="brz-ed-option__block-thumbnail-anchor"
        onClick={this.handleContainerClick}
      >
        <span className="brz-span">#</span>
        <input
          className="brz-input"
          type="text"
          autoComplete="off"
          placeholder={t("block-name")}
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          id={inputID}
        />
        <label className="brz-label" htmlFor={inputID}>
          <EditorIcon icon="nc-pen" />
        </label>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  pageBlocks: pageBlocksSelector(state),
  pageBlocksAssembled: pageBlocksAssembledSelector(state),
  globalBlocks: globalBlocksAssembled2Selector(state)
});

export default connect(mapStateToProps)(BlockThumbnail);
