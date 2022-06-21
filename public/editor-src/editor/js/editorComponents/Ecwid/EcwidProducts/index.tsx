import React, { createRef, ReactNode } from "react";
import classNames from "classnames";
import { uniqueId } from "underscore";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import Config from "visual/global/Config";
import { isCloud } from "visual/global/Config/types/configs/Cloud";
import { EcwidService } from "visual/libs/Ecwid";

type Model = {
  productId: string;
};

export class EcwidProducts extends EditorComponent<Model> {
  private uniqueId = `${EcwidProducts.componentId}-${uniqueId()}`;

  private containerRef = createRef<HTMLDivElement>();

  static get componentId(): "EcwidProducts" {
    return "EcwidProducts";
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
      EcwidService.init(config.modules.shop.storeId).products(
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
            "brz-ecwid-products-wrapper"
          )
        })}
      >
        <div
          className="brz-ecwid-products"
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
            "brz-ecwid-products-wrapper"
          )
        })}
      >
        <div
          className="brz-ecwid-products"
          data-store-id="{{ecwid_store_id}}"
        />
      </Wrapper>
    );
  }
}
