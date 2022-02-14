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

export class Quantity extends EditorComponent<ElementModel> {
  static get componentId(): "Quantity" {
    return "Quantity";
  }

  static defaultValue = defaultValue;

  handleTextChange = (patch: ElementModel): void => this.patchValue(patch);

  renderForEdit(
    v: ElementModel,
    vs: ElementModel,
    vd: ElementModel
  ): React.ReactNode {
    const className = classnames(
      "brz-shopify-quantity",
      css(this.getId(), this.getId(), style(v, vs, vd))
    );

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
            <input type="number" value={0} min={0} max={100} />
          </Wrapper>
        </CustomCSS>
      </PortalToolbar>
    );
  }
}
