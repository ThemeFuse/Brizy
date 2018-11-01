import React from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import BoxResizer from "visual/component-new/BoxResizer";
import Placeholder from "visual/component-new/Placeholder";
import Toolbar from "visual/component-new/Toolbar";
import * as toolbarConfig from "./toolbar";
import { styleClassName, styleCSSVars } from "./styles";
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

  renderForEdit(v) {
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
      <iframe
        className={wrapperClassName}
        scrolling="no"
        frameBorder="no"
        src={src}
      />
    );

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig(toolbarConfig)}>
        <div className={styleClassName(v)} style={styleCSSVars(v)}>
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
      </Toolbar>
    );
  }
}

export default SoundCloud;
