import classnames from "classnames";
import React, { ReactNode } from "react";
import CustomCSS from "visual/component/CustomCSS";
import Link from "visual/component/Link";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { shouldRenderPopup } from "visual/editorComponents/tools/Popup";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import { blocksDataSelector } from "visual/redux/selectors";
import { Block } from "visual/types/Block";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { getLinkData } from "visual/utils/models/link";
import { attachRefs } from "visual/utils/react";
import EditorArrayComponent from "../EditorArrayComponent";
import { DynamicContentHelper } from "../WordPress/common/DynamicContentHelper";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { Props, Value } from "./types";

class Leadific extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;
  static experimentalDynamicContent = true;

  static get componentId(): ElementTypes.Leadific {
    return ElementTypes.Leadific;
  }

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarConfig,
      undefined,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.getComponentId()}Parent`
      }
    );

    this.props.extendParentToolbar(toolbarExtend);
  }

  renderPopups(): ReactNode {
    const meta = this.props.meta;
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: (itemData: Block) => {
        let {
          value: { popupId }
        } = itemData;

        const { blockId } = itemData;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          const globalBlocks = blocksDataSelector(this.getReduxState());
          const blockData = globalBlocks[itemData.value._id];

          if (blockData) {
            popupId = blockData.value.popupId;
          }
        }

        return {
          blockId,
          meta,
          ...(isEditor(this.props.renderContext) && {
            instanceKey: `${this.getId()}_${popupId}`
          })
        };
      }
    });

    // @ts-expect-error: Need transform EditorArrayComponents to ts
    return <EditorArrayComponent {...popupsProps} />;
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const { leadificCustomFields = "" } = v;
    const config = this.getGlobalConfig();
    const linkData = getLinkData(v, config);

    const className = classnames(
      "brz-leadific",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const text = (
      <DynamicContentHelper
        placeholder={makePlaceholder({
          content: "{{brizy_leadific_field}}",
          attr: { key: leadificCustomFields }
        })}
        props={{ className: "brz-leadific__content" }}
        blocked={false}
        tagName="div"
        placeholderIcon="leadific"
      />
    );
    return (
      <>
        <Toolbar
          {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        >
          {({ ref }) => (
            <CustomCSS selectorName={this.getId()} css={v.customCSS}>
              {({ ref: cssRef }) => (
                <Wrapper
                  {...this.makeWrapperProps({
                    className,
                    ref: (el) => {
                      attachRefs(el, [ref, cssRef]);
                    }
                  })}
                >
                  {linkData.href ? (
                    <Link
                      href={linkData.href}
                      type={linkData.type}
                      target={linkData.target}
                      rel={linkData.rel}
                    >
                      {text}
                    </Link>
                  ) : (
                    text
                  )}
                </Wrapper>
              )}
            </CustomCSS>
          )}
        </Toolbar>
        {shouldRenderPopup(v, blocksDataSelector(this.getReduxState())) &&
          this.renderPopups()}
      </>
    );
  }
}

export default Leadific;
