import classnames from "classnames";
import React from "react";
import BoxResizer from "visual/component/BoxResizer";
import CustomCSS from "visual/component/CustomCSS";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { isEditor } from "visual/providers/RenderProvider";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";

const resizerPoints = [
  "topLeft",
  "topCenter",
  "topRight",
  "centerLeft",
  "centerRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight"
];

class SoundCloud extends EditorComponent {
  static defaultValue = defaultValue;

  static get componentId() {
    return "SoundCloud";
  }

  handleResizerChange = (patch) => this.patchValue(patch);

  getResizerRestrictions(v) {
    return {
      height: {
        px: {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        },
        "%": { min: 5, max: 100 }
      },
      width: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      tabletHeight: {
        px: {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        },
        "%": { min: 5, max: 100 }
      },
      tabletWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      mobileHeight: {
        px: {
          min: 5,
          max: v.style === "basic" ? v.mediumHeight : v.largeHeight
        },
        "%": { min: 5, max: 100 }
      },
      mobileWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      }
    };
  }

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-soundcloud",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );
    // intrinsic-ignore - this class is needed for WP theme twentytwenty(themes/twentytwenty/assets/js/index.js?ver=1.1)
    // intrinsicRatioVideos - property contain function - makeFit which changes iframes width
    // and breaks our code(video, map inside megamenu isn't showing as example)
    const wrapperClassName = classnames("brz-iframe", "intrinsic-ignore", {
      "brz-blocked": isEditor(this.props.renderContext)
    });
    let { url, autoPlay, showArtwork } = v;
    autoPlay = autoPlay === "on";
    showArtwork = showArtwork === "on";
    const src = `https://w.soundcloud.com/player/?url=${url}&amp;auto_play=${autoPlay}&amp;how_teaser=true&amp;visual=${showArtwork}&amp;`;

    const content = !url ? (
      <Placeholder icon="sound-cloud" />
    ) : (
      <div className="brz-soundCloud-content">
        <iframe
          className={wrapperClassName}
          title="sound-cloud"
          scrolling="no"
          frameBorder="no"
          src={src}
        />
      </div>
    );

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={v.customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  ref: (el) => attachRefs(el, [toolbarRef, cssRef])
                })}
              >
                <BoxResizer
                  points={resizerPoints}
                  restrictions={this.getResizerRestrictions(v)}
                  meta={this.props.meta}
                  value={v}
                  onChange={this.handleResizerChange}
                >
                  {content}
                </BoxResizer>
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}

export default SoundCloud;
