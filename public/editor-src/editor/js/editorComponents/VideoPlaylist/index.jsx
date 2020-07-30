import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import Placeholder from "visual/component/Placeholder";
import ThemeIcon from "visual/component/ThemeIcon";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";
import { css } from "visual/utils/cssStyle";
import * as toolbarExtend from "./toolbarExtend";
import * as sidebarExtendConfig from "./sidebarExtend";
import * as toolbarExtendParentConfig from "./toolbarExtendParent";
import * as sidebarExtendParentConfig from "./sidebarExtendParent";
import Items from "./Items";
import { styleContents, styleCover, styleSideBar } from "./styles";
import defaultValue from "./defaultValue.json";
import { Wrapper } from "../tools/Wrapper";

const resizerPoints = ["centerLeft", "centerRight"];

class VideoPlaylist extends EditorComponent {
  static get componentId() {
    return "VideoPlaylist";
  }

  state = { currentIndex: 0 };

  static defaultValue = defaultValue;

  componentDidMount() {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParentConfig,
      sidebarExtendParentConfig,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.constructor.componentId}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleValueChange(newValue, meta) {
    super.handleValueChange(newValue, meta);

    const { items } = meta.patch;

    if (items && items.length < this.state.currentIndex) {
      this.setState({ currentIndex: 0 });
    }
  }

  handleResizerChange = patch => this.patchValue(patch);

  handleActive = currentIndex => this.setState({ currentIndex });

  handleCoverIconClick(e) {
    e.preventDefault();
  }

  getItemValue(v) {
    const itemV = v.items[this.state.currentIndex];
    if (itemV) {
      return itemV.value;
    }

    return v.items[0].value;
  }

  getVideoSrc(v) {
    const itemV = this.getItemValue(v);
    const { branding, intro, video } = itemV;

    const start = itemV.start;
    const end = itemV.end;

    const videoSrc = getVideoData(video);

    return videoSrc
      ? getVideoUrl(videoSrc, {
          controls: itemV.controls === "on" ? 0 : 1,
          branding: branding === "off" ? 1 : 0,
          intro: intro === "off" ? 0 : 1,
          suggestedVideo: false,
          start,
          end
        })
      : "";
  }

  renderCover(videoSrc) {
    return (
      <div className="brz-video-playlist__cover">
        <div className="brz-video-playlist__cover-icon">
          <a
            className="brz-a"
            href={videoSrc}
            onClick={this.handleCoverIconClick}
          >
            <ThemeIcon name="play" type="editor" />
          </a>
        </div>
      </div>
    );
  }

  renderForEdit(v, vs, vd) {
    const { positionItem, positionThumbs, customCSS } = v;
    const { meta } = this.props;
    const { currentIndex } = this.state;
    const itemV = this.getItemValue(v);
    const { coverImageSrc } = itemV;
    const videoSrc = this.getVideoSrc(v);
    const classNameContent = classnames(
      "brz-video-playlist",
      `brz-video-playlist-${positionItem}`,
      `brz-video-playlist-${positionThumbs}`,
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleContents(v, vs, vd)
      ),
      css(
        `${this.constructor.componentId}-cover`,
        `${this.getId()}-cover`,
        styleCover(itemV, vs, vd)
      )
    );
    const classNameSidebar = classnames(
      "brz-video-playlist-col",
      "brz-video-playlist-sidebar",
      css(
        `${this.constructor.componentId}-sidebar`,
        `${this.getId()}-sidebar`,
        styleSideBar(v, vs, vd)
      )
    );
    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      currentIndex,
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtend,
        sidebarExtendConfig,
        { allowExtend: false }
      ),
      meta
    });

    const content = coverImageSrc ? (
      <aside className="brz-video-playlist-col brz-video-playlist-main brz-video-playlist-main__cover">
        {this.renderCover(videoSrc)}
      </aside>
    ) : videoSrc ? (
      <aside className="brz-video-playlist-col brz-video-playlist-main">
        <div className="brz-video-playlist-main__content brz-p-relative brz-pointer-events-none">
          <iframe
            allowFullScreen={true}
            className="brz-iframe"
            src={videoSrc}
          />
        </div>
      </aside>
    ) : (
      <aside className="brz-video-playlist-col brz-video-playlist-main brz-video-playlist-main__placeholder">
        <div className="brz-video-playlist-main__content brz-p-relative">
          <Placeholder icon="play" />
        </div>
      </aside>
    );

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper {...this.makeWrapperProps({ className: classNameContent })}>
          <BoxResizer
            points={resizerPoints}
            meta={meta}
            value={v}
            onChange={this.handleResizerChange}
          >
            <div className="brz-video-playlist__container brz-ow-hidden brz-p-relative">
              {positionItem === "horizontal" && content}
              <section className={classNameSidebar}>
                <Items {...itemProps} onActiveChange={this.handleActive} />
              </section>
              {positionItem === "vertical" && content}
            </div>
          </BoxResizer>
        </Wrapper>
      </CustomCSS>
    );
  }

  renderForView(v, vs, vd) {
    const { positionItem, positionThumbs, customCSS } = v;
    const itemV = this.getItemValue(v);
    const { coverImageSrc } = itemV;
    const videoSrc = this.getVideoSrc(v);
    const classNameContent = classnames(
      "brz-video-playlist",
      `brz-video-playlist-${positionItem}`,
      `brz-video-playlist-${positionThumbs}`,
      "brz-ow-hidden",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleContents(v, vs, vd)
      ),
      css(
        `${this.constructor.componentId}-cover`,
        `${this.getId()}-cover`,
        styleCover(itemV, vs, vd)
      )
    );
    const classNameSidebar = classnames(
      "brz-video-playlist-col",
      "brz-video-playlist-sidebar",
      css(
        `${this.constructor.componentId}-sidebar`,
        `${this.getId()}-sidebar`,
        styleSideBar(v, vs, vd)
      )
    );
    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      currentIndex: 0,
      meta: this.props.meta
    });
    const coverClassName = classnames(
      "brz-video-playlist-col",
      "brz-video-playlist-main",
      "brz-video-playlist-main__cover",
      { "brz-d-none": !coverImageSrc }
    );
    const videoClassName = classnames(
      "brz-video-playlist-col",
      "brz-video-playlist-main",
      "brz-video-playlist-main__video",
      { "brz-d-none": !videoSrc || coverImageSrc }
    );
    const placeholderClassName = classnames(
      "brz-video-playlist-col",
      "brz-video-playlist-main",
      "brz-video-playlist-main__placeholder",
      { "brz-d-none": videoSrc || coverImageSrc }
    );

    const content = (
      <>
        <aside className={coverClassName}>{this.renderCover(videoSrc)}</aside>
        <aside className={videoClassName}>
          <div className="brz-video-playlist-main__content brz-p-relative">
            <iframe
              className="brz-iframe"
              allowFullScreen={true}
              allow="autoplay"
              src={videoSrc}
            />
          </div>
        </aside>
        <aside className={placeholderClassName}>
          <div className="brz-video-playlist-main__content brz-p-relative">
            <Placeholder icon="play" />
          </div>
        </aside>
      </>
    );

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div className={classNameContent}>
          {positionItem === "horizontal" && content}
          <section className={classNameSidebar}>
            <Items {...itemProps} onActiveChange={this.handleActive} />
          </section>
          {positionItem === "vertical" && content}
        </div>
      </CustomCSS>
    );
  }
}

export default VideoPlaylist;
