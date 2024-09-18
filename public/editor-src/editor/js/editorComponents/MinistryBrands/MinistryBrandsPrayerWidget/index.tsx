import React, { ReactNode } from "react";
import { ElementModel } from "visual/component/Elements/Types";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ComponentsMeta } from "visual/editorComponents/EditorComponent/types";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { DynamicContentHelper } from "visual/editorComponents/WordPress/common/DynamicContentHelper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { WithClassName } from "visual/types/attributes";
import { makePlaceholder } from "visual/utils/dynamicContent";

export interface Props extends WithClassName {
  meta: ComponentsMeta;
}

export class MinistryBrandsPrayerWidget extends EditorComponent<
  ElementModel,
  Props
> {
  static get componentId(): ElementTypes.MinistryBrandsPrayerWidget {
    return ElementTypes.MinistryBrandsPrayerWidget;
  }
  static defaultValue = {};
  static experimentalDynamicContent = true;

  renderForEdit(): ReactNode {
    const placeholder = makePlaceholder({
      content: "{{ekk_prayer}}"
    });

    return (
      <Wrapper
        {...this.makeWrapperProps({
          className: "brz-ministryBrands"
        })}
      >
        <DynamicContentHelper
          placeholder={placeholder}
          blocked={false}
          props={{ className: "brz-prayerWidget" }}
          tagName="div"
        />
      </Wrapper>
    );
  }
}
