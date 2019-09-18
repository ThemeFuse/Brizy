import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import CustomCSS from "visual/component/CustomCSS";
import BoxResizer from "visual/component/BoxResizer";
import Placeholder from "visual/component/Placeholder";
import Toolbar from "visual/component/Toolbar";
import * as toolbarConfig from "./toolbar";
import { css } from "visual/utils/cssStyle";
import { style } from "./styles";
import defaultValue from "./defaultValue.json";

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
  static get componentId() {
    return "SoundCloud";
  }

  static defaultValue = defaultValue;

  handleResizerChange = patch => this.patchValue(patch);

  getResizerRestrictions(v) {
    return {
      height: {
        min: 5,
        max: v.style === "basic" ? v.mediumHeight : v.largeHeight
      },
      width: {
        min: 5,
        max: 100
      },
      tabletHeight: {
        min: 5,
        max: v.style === "basic" ? v.mediumHeight : v.largeHeight
      },
      tabletWidth: {
        min: 5,
        max: 100
      },
      mobileHeight: {
        min: 5,
        max: v.style === "basic" ? v.mediumHeight : v.largeHeight
      },
      mobileWidth: {
        min: 5,
        max: 100
      }
    };
  }

  renderForEdit(v, vs, vd) {
    const className = classnames(
      "brz-soundcloud",
      css(
        `${this.constructor.componentId}`,
        `${this.getId()}`,
        style(v, vs, vd)
      )
    );
    const wrapperClassName = classnames("brz-iframe", {
      "brz-blocked": IS_EDITOR
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
          scrolling="no"
          frameBorder="no"
          src={src}
        />
      </div>
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className={className}>
            <BoxResizer
              points={resizerPoints}
              restrictions={this.getResizerRestrictions(v)}
              meta={this.props.meta}
              value={v}
              onChange={this.handleResizerChange}
            >
              {content}
            </BoxResizer>
          </div>
        </CustomCSS>
      </Toolbar>
    );
  }
}

export default SoundCloud;
