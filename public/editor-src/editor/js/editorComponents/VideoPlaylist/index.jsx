import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import classnames from "classnames";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import Placeholder from "visual/component/Placeholder";
import ThemeIcon from "visual/component/ThemeIcon";
import Items from "./Items";
import {
  videoData as getVideoData,
  videoUrl as getVideoUrl
} from "visual/utils/video";
import * as toolbarExtend from "./toolbarExtend";
import * as sidebarExtendConfig from "./sidebarExtend";
import * as toolbarExtendParentConfig from "./toolbarExtendParent";
import * as sidebarExtendParentConfig from "./sidebarExtendParent";
import { styleContents, styleSideBar } from "./styles";
import { styleItem } from "./VideoPlaylistItem/styles";
import { css } from "visual/utils/cssStyle";
import defaultValue from "./defaultValue.json";

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

  handleResizerChange = patch => this.patchValue(patch);

  handleActive = currentIndex => this.setState({ currentIndex });

  handleCoverIconClick(e) {
    e.preventDefault();
  }

  getVideoSrc(v) {
    const itemV = v.items[this.state.currentIndex].value;

    const start = itemV.start;
    const end = itemV.end;

    if (itemV.videoPopulation) {
      return itemV.videoPopulation;
    }

    const videoSrc = getVideoData(itemV.video);

    let branding = itemV.branding;
    if (itemV.branding === "off") {
      branding = 1;
    } else if (itemV.branding === "on") {
      branding = 0;
    }

    let intro = itemV.intro;
    if (itemV.intro === "off") {
      intro = 0;
    } else if (itemV.intro === "on") {
      intro = 1;
    }

    return videoSrc
      ? getVideoUrl(videoSrc, {
          autoplay: Boolean(itemV.coverImageSrc),
          controls: itemV.controls === "on" ? 0 : 1,
          branding,
          intro,
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
    const itemV = v.items[this.state.currentIndex].value;

    const videoSrc = this.getVideoSrc(v);

    const classNameContent = classnames(
      "brz-video-playlist",
      { "brz-video-playlist-horizontal": v.positionItem === "horizontal" },
      { "brz-video-playlist-vertical": v.positionItem === "vertical" },
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        styleContents(v, vs, vd)
      )
    );

    const classNameSidebar = classnames(
      "col",
      "sidebar",
      css(
        `${this.constructor.componentId}-sidebar`,
        `${this.getId()}-sidebar`,
        styleSideBar(v, vs, vd)
      )
    );

    const classNameGrid = classnames(
      "flex-grid",
      css(
        `${this.constructor.componentId}-grid`,
        `${this.getId()}-grid`,
        styleItem(itemV, vs, vd)
      )
    );

    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      currentIndex: this.state.currentIndex,
      toolbarExtend: this.makeToolbarPropsFromConfig2(
        toolbarExtend,
        sidebarExtendConfig,
        {
          allowExtend: false
        }
      ),
      meta: this.props.meta
    });

    let content = itemV.coverImageSrc ? (
      this.renderCover(videoSrc)
    ) : videoSrc ? (
      <iframe allowFullScreen={true} className="brz-iframe" src={videoSrc} />
    ) : (
      <Placeholder icon="play" />
    );

    if (
      (!videoSrc && !itemV.coverImageSrc) ||
      (IS_PREVIEW && itemV.videoPopulation && !itemV.coverImageSrc)
    ) {
      content = <Placeholder icon="play" />;
    }

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCSS}>
        <div className={classNameContent}>
          <BoxResizer
            points={resizerPoints}
            meta={this.props.meta}
            value={v}
            onChange={this.handleResizerChange}
          >
            <div className={classNameGrid}>
              <aside className="col main">
                <div className="video-container">
                  <div className="brz-video-content">
                    <div className="brz-image-fix">{content}</div>
                  </div>
                </div>
              </aside>
              <section className={classNameSidebar}>
                <Items {...itemProps} onActiveChange={this.handleActive} />
              </section>
            </div>
          </BoxResizer>
        </div>
      </CustomCSS>
    );
  }
}

export default VideoPlaylist;
