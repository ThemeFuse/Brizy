import classnames from "classnames";
import React from "react";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementModel } from "visual/component/Elements/Types";
import PortalToolbar from "visual/component/Toolbar";
import CustomCSS from "visual/component/CustomCSS";
import { css } from "visual/utils/cssStyle";
import { Wrapper } from "../../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import { getItems as toolbar } from "./toolbar";
import { getItems as sidebar } from "./sidebar";
import { style } from "./styles";

export class Variations extends EditorComponent<ElementModel> {
  static get componentId(): "Variations" {
    return "Variations";
  }

  static defaultValue = defaultValue;

  handleTextChange = (patch: ElementModel): void => this.patchValue(patch);

  renderForEdit(
    v: ElementModel,
    vs: ElementModel,
    vd: ElementModel
  ): React.ReactNode {
    const className = classnames(
      "brz-shopify-variations",
      css(this.getId(), this.getId(), style(v, vs, vd))
    );

    const handle = String(v.itemId);

    return (
      <PortalToolbar
        {...this.makeToolbarPropsFromConfig2(
          { getItems: toolbar },
          { getItems: sidebar }
        )}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <Wrapper
            {...this.makeWrapperProps({
              className,
              attributes: { "data-product-handle": v.itemId }
            })}
          >
            <div>
              <input type="radio" data-product-handle={handle} value={0} /> S
            </div>
            <div>
              <input type="radio" data-product-handle={handle} value={1} /> M
            </div>
            <div>
              <input type="radio" data-product-handle={handle} value={2} /> L
            </div>
          </Wrapper>
        </CustomCSS>
      </PortalToolbar>
    );
  }
}
