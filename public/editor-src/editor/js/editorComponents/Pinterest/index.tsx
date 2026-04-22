import React from "react";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent, {
  type Props as EditorComponentProps
} from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import { getEmbedAnchorProps } from "./getEmbedProps";
import { rebuildPinterest } from "./scripts";
import * as toolbarConfig from "./toolbar";
import { Value } from "./types";

export default class Pinterest extends EditorComponent<Value> {
  static get componentId(): ElementTypes.Pinterest {
    return ElementTypes.Pinterest;
  }

  static defaultValue = defaultValue;

  componentDidMount(): void {
    rebuildPinterest(document);
  }

  componentDidUpdate(
    prevProps: EditorComponentProps<Value, Record<string, unknown>>
  ): void {
    const { addonType: prevAddonType, url: prevUrl } = prevProps.dbValue;
    const { addonType, url } = this.getValue();

    if (prevAddonType !== addonType || prevUrl !== url) {
      rebuildPinterest(document);
    }
  }

  private renderEmbedAnchor(v: Value): React.JSX.Element {
    const anchorProps = getEmbedAnchorProps(v);

    return <a {...anchorProps} />;
  }

  getWrapperClassName(v: Value): string {
    const { addonType } = v;

    return this.getCSSClassnames({
      toolbars: [toolbarConfig],
      extraClassNames: ["brz-pinterest", `brz-pinterest--${addonType}`]
    });
  }

  renderForEdit(v: Value): React.JSX.Element {
    const { customCSS } = v;

    const className = this.getWrapperClassName(v);

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
                {/* This div is necessary to avoid losing the toolbar. If the key were applied to <Wrapper/>, the reference would be lost upon reinitialization */}
                <div
                  key={`${v.addonType}-${v.url}`}
                  className="brz-ed-pinterest--content"
                >
                  {this.renderEmbedAnchor(v)}
                </div>
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }

  renderForView(v: Value): React.JSX.Element {
    const { customCSS } = v;

    const className = this.getWrapperClassName(v);

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <div className={className}>{this.renderEmbedAnchor(v)}</div>
      </CustomCSS>
    );
  }
}
