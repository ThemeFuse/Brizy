import React from "react";
import { LinkedInEmbed } from "react-social-media-embed";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { onOffToBool } from "visual/utils/boolean";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as toolbarConfig from "./toolbar";
import { Value } from "./types";

export default class LinkedinFeed extends EditorComponent<Value> {
  static get componentId(): ElementTypes.LinkedinFeed {
    return ElementTypes.LinkedinFeed;
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  renderForEdit(v: Value): React.JSX.Element {
    const {
      customCSS,
      embedUrl,
      placeholderSpinner,
      linkText,
      placeholderSpinnerDisabled,
      placeholderDisabled
    } = v;

    const _placeholderSpinnerDisabled = onOffToBool(placeholderSpinnerDisabled);
    const _placeholderDisabled = onOffToBool(placeholderDisabled);

    const className = this.getCSSClassnames({
      toolbars: [toolbarConfig],
      extraClassNames: ["brz-linkedin-feed"]
    });

    const key = `${embedUrl}${placeholderSpinner}${linkText}${_placeholderSpinnerDisabled}${_placeholderDisabled}`;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  ref: (el) => attachRefs(el, [toolbarRef, cssRef])
                })}
              >
                <LinkedInEmbed
                  key={key}
                  url={embedUrl}
                  placeholderSpinner={placeholderSpinner}
                  linkText={linkText}
                  placeholderDisabled={_placeholderDisabled}
                  placeholderSpinnerDisabled={_placeholderSpinnerDisabled}
                />
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}
