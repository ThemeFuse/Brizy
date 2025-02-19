import React from "react";
import { InstagramEmbed } from "react-social-media-embed";
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

export default class InstagramFeed extends EditorComponent<Value> {
  static get componentId(): ElementTypes.InstagramFeed {
    return ElementTypes.InstagramFeed;
  }

  static defaultValue = defaultValue;

  static experimentalDynamicContent = true;

  renderForEdit(v: Value): React.JSX.Element {
    const {
      customCSS,
      embedUrl,
      placeholderSpinner,
      linkText,
      captioned,
      placeholderSpinnerDisabled,
      placeholderDisabled,
      scriptLoadDisabled
    } = v;

    const _captioned = onOffToBool(captioned);
    const _placeholderSpinnerDisabled = onOffToBool(placeholderSpinnerDisabled);
    const _placeholderDisabled = onOffToBool(placeholderDisabled);
    const _scriptLoadDisabled = onOffToBool(scriptLoadDisabled);

    const className = this.getCSSClassnames({
      toolbars: [toolbarConfig],
      extraClassNames: ["brz-instagram-feed"]
    });

    const key = `${embedUrl}${placeholderSpinner}${linkText}${_captioned}${_placeholderSpinnerDisabled}${_placeholderDisabled}${_scriptLoadDisabled}`;

    return (
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbarConfig)}>
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper
                {...this.makeWrapperProps({
                  className,
                  ref: (el) => {
                    attachRefs(el, [toolbarRef, cssRef]);
                  }
                })}
              >
                <InstagramEmbed
                  key={key}
                  url={embedUrl}
                  placeholderSpinner={placeholderSpinner}
                  linkText={linkText}
                  captioned={_captioned}
                  placeholderSpinnerDisabled={_placeholderSpinnerDisabled}
                  placeholderDisabled={_placeholderDisabled}
                  scriptLoadDisabled={_scriptLoadDisabled}
                />
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }
}
