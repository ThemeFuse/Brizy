import classnames from "classnames";
import React, { ReactElement, ReactNode } from "react";
import BoxResizer from "visual/component/BoxResizer";
import { TextEditor } from "visual/component/Controls/TextEditor";
import CustomCSS from "visual/component/CustomCSS";
import { ElementModel } from "visual/component/Elements/Types";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent, {
  Props as EProps
} from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
import { encodeToString } from "visual/utils/string";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebar from "./sidebar";
import * as sidebarExtendParent from "./sidebarExtendParent";
import { styles } from "./styles";
import * as toolbar from "./toolbar";
import * as toolbarExtendParent from "./toolbarExtendParent";

const resizerPoints = ["centerLeft", "centerRight"];

type Item = {
  type: string;
  value: ElementModel;
};

interface Value extends ElementModel {
  items: Item[];
  label: string;
  className: string;
  emptyMessage: string;
  invalidMessage: string;
  failMessage: string;
  customCSS: string;
}

export type Props = EProps<Value, Record<string, unknown>>;

export default class ProtectedPage extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.ProtectedPage {
    return ElementTypes.ProtectedPage;
  }

  handleResizerChange = (patch: Partial<ElementModel>): void => {
    return this.patchValue(patch);
  };

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      // @ts-expect-error: Need transform all toolbars config to ts
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.getComponentId()}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);
  }

  handleLabelChange = (label: string): void => {
    this.patchValue({ label });
  };

  renderButton(): ReactNode {
    const itemProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        meta: this.props.meta
      }
    });
    /**
     * Since the EditorArrayComponent is still in JS
     * TS cannot read properly it's return type
     * @ts-expect-error unknown is not assignable */
    return <EditorArrayComponent {...itemProps} />;
  }

  renderForEdit(v: Value, vs: Value, vd: Value): ReactElement {
    const { customCSS, label, className: _className } = v;
    const className = classnames(
      "brz-protected",
      _className,
      this.css(
        this.getComponentId(),
        this.getId(),
        styles({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );
    const resizerRestrictions = {
      width: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      tabletWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      },
      mobileWidth: {
        px: { min: 5, max: 1000 },
        "%": { min: 5, max: 100 }
      }
    };

    return (
      // @ts-expect-error: Need transform all toolbars config to ts
      <Toolbar {...this.makeToolbarPropsFromConfig2(toolbar, sidebar)}>
        {({ ref: toolbarRef }) => (
          <CustomCSS selectorName={this.getId()} css={customCSS}>
            {({ ref: cssRef }) => (
              <Wrapper<Props>
                {...this.makeWrapperProps({
                  className,
                  ref: (el) => {
                    attachRefs(el, [toolbarRef, cssRef]);
                  }
                })}
              >
                <BoxResizer
                  points={resizerPoints}
                  restrictions={resizerRestrictions}
                  meta={this.props.meta}
                  value={v}
                  onChange={this.handleResizerChange}
                >
                  <form className="brz-form brz-protected-form">
                    <div className="brz-protected-form__input">
                      <TextEditor
                        className="brz-input"
                        value={label}
                        onChange={this.handleLabelChange}
                      />
                    </div>
                    <div className="brz-protected-form__button">
                      {this.renderButton()}
                    </div>
                  </form>
                </BoxResizer>
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactElement {
    const {
      customCSS,
      label,
      className: _className,
      emptyMessage,
      invalidMessage,
      failMessage
    } = v;
    const className = classnames(
      "brz-protected",
      _className,
      this.css(
        this.getComponentId(),
        this.getId(),
        styles({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          contexts: this.getContexts()
        })
      )
    );

    const messages = encodeToString({
      empty: emptyMessage,
      fail: failMessage,
      invalid: invalidMessage
    });

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <Wrapper<Props> {...this.makeWrapperProps({ className })}>
          <form
            className="brz-form brz-protected-form"
            {...makeDataAttr({
              name: "messages",
              value: messages,
              translatable: true
            })}
          >
            <div className="brz-protected-form__input">
              <input
                name="protected"
                className="brz-input"
                placeholder={label}
              />
            </div>
            <div className="brz-protected-form__button">
              {this.renderButton()}
            </div>
          </form>
        </Wrapper>
      </CustomCSS>
    );
  }
}
