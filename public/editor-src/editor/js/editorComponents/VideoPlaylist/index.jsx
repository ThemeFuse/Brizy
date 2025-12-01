import classnames from "classnames";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { Wrapper } from "../tools/Wrapper";
import Items from "./Items";
import defaultValue from "./defaultValue.json";
import * as sidebarExtendConfig from "./sidebarExtend";
import * as sidebarExtendParentConfig from "./sidebarExtendParent";
import { styleContents, styleCover, styleSidebar } from "./styles";
import * as toolbarExtend from "./toolbarExtend";
import * as toolbarExtendParentConfig from "./toolbarExtendParent";

const resizerPoints = ["centerLeft", "centerRight"];

class VideoPlaylist extends EditorComponent {
  static defaultValue = defaultValue;
  state = { currentIndex: 0 };

  static get componentId() {
    return ElementTypes.VideoPlaylist;
  }

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParentConfig,
      sidebarExtendParentConfig,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.getComponentId()}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleValueChange(newValue, meta) {
    super.handleValueChange(newValue, meta);

    const { currentIndex } = this.state;
    const { items } = meta.patch;

    if (items && items.length === currentIndex) {
      this.setState((prevState) => ({
        currentIndex: prevState.currentIndex - 1
      }));
    }

    if (items && items.length < currentIndex) {
      this.setState({ currentIndex: 0 });
    }
  }

  handleResizerChange = (patch) => this.patchValue(patch);

  handleActive = (currentIndex) => this.setState({ currentIndex });

  getItemValue(v) {
    const itemV = v.items[this.state.currentIndex];
    if (itemV) {
      return itemV.value;
    }

    return v.items[0].value;
  }

  renderForEdit(v, vs, vd) {
    const { positionItem, positionThumbs, customCSS } = v;
    const { meta } = this.props;
    const { currentIndex } = this.state;
    const itemV = this.getItemValue(v);

    const classNameContent = classnames(
      "brz-video-playlist",
      `brz-video-playlist-${positionItem}`,
      `brz-video-playlist-${positionThumbs}`,
      this.css(
        `${this.getComponentId()}`,
        `${this.getId()}`,
        styleContents({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      ),
      this.css(
        `${this.getComponentId()}-cover`,
        `${this.getId()}-cover`,
        styleCover({
          v: itemV,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const classNameSidebar = classnames(
      "brz-video-playlist-col",
      "brz-video-playlist-sidebar",
      this.css(
        `${this.getComponentId()}-sidebar`,
        `${this.getId()}-sidebar`,
        styleSidebar({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const itemSidebarProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      currentIndex,
      meta,
      renderType: "sidebar",
      onActiveChange: this.handleActive,
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtend,
        sidebarExtendConfig,
        { allowExtend: false }
      )
    });

    const itemVideoProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      currentIndex,
      sliceStartIndex: currentIndex,
      sliceEndIndex: currentIndex + 1,
      meta,
      renderType: "video"
    });

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        {({ ref: cssRef }) => (
          <Wrapper
            {...this.makeWrapperProps({
              className: classNameContent,
              ref: cssRef
            })}
          >
            <BoxResizer
              points={resizerPoints}
              meta={meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              <div className="brz-video-playlist__container brz-ow-hidden brz-p-relative">
                {positionItem === "horizontal" && <Items {...itemVideoProps} />}
                <div className={classNameSidebar}>
                  <Items
                    {...itemSidebarProps}
                    onActiveChange={this.handleActive}
                  />
                </div>
                {positionItem === "vertical" && <Items {...itemVideoProps} />}
              </div>
            </BoxResizer>
          </Wrapper>
        )}
      </CustomCSS>
    );
  }

  renderForView(v, vs, vd) {
    const { positionItem, positionThumbs, customCSS } = v;
    const { meta } = this.props;
    const itemV = this.getItemValue(v);

    const classNameContent = classnames(
      "brz-video-playlist",
      `brz-video-playlist-${positionItem}`,
      `brz-video-playlist-${positionThumbs}`,
      "brz-ow-hidden",
      this.css(
        this.getComponentId(),
        this.getId(),
        styleContents({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      ),
      this.css(
        `${this.getComponentId()}-cover`,
        `${this.getId()}-cover`,
        styleCover({
          v: itemV,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const classNameSidebar = classnames(
      "brz-video-playlist-col",
      "brz-video-playlist-sidebar",
      this.css(
        `${this.getComponentId()}-sidebar`,
        `${this.getId()}-sidebar`,
        styleSidebar({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const itemSidebarProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      currentIndex: 0,
      meta,
      renderType: "sidebar"
    });

    const itemVideoProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      currentIndex: 0,
      sliceStartIndex: 0,
      sliceEndIndex: 1,
      meta,
      renderType: "video"
    });

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper {...this.makeWrapperProps({ className: classNameContent })}>
          {positionItem === "horizontal" && <Items {...itemVideoProps} />}
          <div className={classNameSidebar}>
            <Items {...itemSidebarProps} />
          </div>
          {positionItem === "vertical" && <Items {...itemVideoProps} />}
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default VideoPlaylist;
