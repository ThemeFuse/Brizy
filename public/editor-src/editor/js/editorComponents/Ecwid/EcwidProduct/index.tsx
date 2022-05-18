import React, { createRef, ReactNode } from "react";
import { uniqueId } from "underscore";
import classNames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import Config from "visual/global/Config";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { EcwidService } from "visual/libs/Ecwid";

type Model = {
  productId: string;
};

export class EcwidProduct extends EditorComponent<Model> {
  private uniqueId = `${EcwidProduct.componentId}-${uniqueId()}`;

  private containerRef = createRef<HTMLDivElement>();

  static get componentId(): "EcwidProduct" {
    return "EcwidProduct";
  }

  componentDidMount(): void {
    if (!IS_EDITOR) {
      return;
    }

    const config = Config.getAll();

    if (
      this.containerRef.current &&
      isCloud(config) &&
      config.modules?.shop?.type === "ecwid"
    ) {
      EcwidService.init(config.modules.shop.storeId).product(
        config.modules.shop.defaultProductId,
        this.containerRef.current
      );
    }
  }

  renderForEdit(): React.ReactNode {
    return (
      <Wrapper
        {...this.makeWrapperProps({
          className: classNames(
            "brz-ecwid-wrapper",
            "brz-ecwid-product-wrapper"
          )
        })}
      >
        <div
          className="brz-ecwid-product"
          id={this.uniqueId}
          ref={this.containerRef}
        />
      </Wrapper>
    );
  }

  renderForView(): ReactNode {
    return (
      <Wrapper
        {...this.makeWrapperProps({
          className: classNames(
            "brz-ecwid-wrapper",
            "brz-ecwid-product-wrapper"
          )
        })}
      >
        <div
          className="brz-ecwid-product"
          data-product-id="{{brizy_dc_post_id}}"
          data-store-id="{{ecwid_store_id}}"
        />
      </Wrapper>
    );
  }
}
