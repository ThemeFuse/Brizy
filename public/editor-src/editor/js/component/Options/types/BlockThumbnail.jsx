import React from "react";
import classnames from "classnames";
import _ from "underscore";
import ScrollPane from "visual/component/ScrollPane";
import EditorIcon from "visual/component/EditorIcon";
import { imageWrapperSize } from "visual/utils/image";
import { blockThumbnailData } from "visual/utils/blocks";
import { getStore } from "visual/redux/store";
import { pageDataSelector, pageBlocksSelector } from "visual/redux/selectors";
import { updatePage } from "visual/redux/actionCreators";
import { t } from "visual/utils/i18n";

const MAX_CONTAINER_WIDTH = 132;

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
    const store = getStore();
    const pageData = pageDataSelector(store.getState());
    const blocks = pageData.items || [];
    const encodedText = encodeURIComponent(text);

    let anchorName = encodedText;
    if (anchorName !== "") {
      // suppose we have the following blockAnchorNames ["contact", "about-us"]
      // if we add "contact" once again we must detect that it's already used
      // and transform it to "contact-2"
      const blockAnchorNames = blocks
        .filter(block => block.value._id !== id)
        .map(block => block.value.anchorName);
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

    store.dispatch(
      updatePage({
        data: {
          ...pageData,
          items: updatedBlocks
        }
      })
    );

    this.anchorInputRefs[id].setValue(anchorName);
  }, 1000);

  renderLabel() {
    const { label, helper: _helper, helperContent } = this.props;
    const helper = _helper ? (
      <div className="brz-ed-option__helper">
        <EditorIcon icon="nc-alert-circle-que" />
        <div className="brz-ed-option__helper__content">{helperContent}</div>
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
    const { value } = this.props;
    const blocks = pageBlocksSelector(getStore().getState()).filter(
      block => block.value._blockVisibility !== "unlisted"
    );

    return blocks.map(block => {
      const { _id, anchorName } = block.value;
      const {
        url,
        width: thumbnailWidth,
        height: thumbnailHeight
      } = blockThumbnailData(block);
      const { width, height } = imageWrapperSize(
        thumbnailWidth,
        thumbnailHeight,
        MAX_CONTAINER_WIDTH
      );

      const figureClassName = classnames("brz-figure", {
        active: _id === value
      });
      const imgStyle = {
        width: `${width}px`,
        height: `${height}px`
      };
      const inputValue = anchorName ? decodeURIComponent(anchorName) : "";

      return (
        <figure
          key={_id}
          className={figureClassName}
          onClick={() => this.handleThumbnailClick(_id)}
        >
          <div className="brz-ed-option__block-thumbnail-loading">
            <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
          </div>
          <img className="brz-img" src={url} style={imgStyle} />

          <AnchorInput
            ref={el => {
              // when the component unmounts this function is also called
              // with el being null and this.anchorInputRefs is also null from componentWillUnmount
              // thus causing property of null error if not guarded
              if (el) {
                this.anchorInputRefs[_id] = el;
              }
            }}
            value={inputValue}
            id={_id}
            onChange={value => this.handleInputChange(value, _id)}
          />
        </figure>
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
          placeholder={t("anchor-name")}
          value={this.state.inputValue}
          onChange={this.handleInputChange}
          id={inputID}
        />
        <label htmlFor={inputID}>
          <EditorIcon icon="nc-pen" />
        </label>
      </div>
    );
  }
}

export default BlockThumbnail;
