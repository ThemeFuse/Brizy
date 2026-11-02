import classnames from "classnames";
import { Cookie } from "lucide-react";
import React, { type ReactElement, type RefObject } from "react";
import ReactDOM from "react-dom";
import { Text } from "visual/component/ContentOptions/types";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { isEditor } from "visual/providers/RenderProvider";
import { t } from "visual/utils/i18n";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { attachRef } from "visual/utils/react";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as sidebarAcceptButton from "./sidebarAcceptButton";
import * as sidebarCustomizeButton from "./sidebarCustomizeButton";
import * as sidebarDialogAcceptButton from "./sidebarDialogAcceptButton";
import * as sidebarRejectButton from "./sidebarRejectButton";
import * as sidebarSaveButton from "./sidebarSaveButton";
import * as toolbarConfig from "./toolbar";
import * as toolbarAcceptButton from "./toolbarAcceptButton";
import * as toolbarCustomizeButton from "./toolbarCustomizeButton";
import * as toolbarDialogAcceptButton from "./toolbarDialogAcceptButton";
import * as toolbarRejectButton from "./toolbarRejectButton";
import * as toolbarSaveButton from "./toolbarSaveButton";
import type { ButtonSpec, Props, Value } from "./types";
import { getCategories, getOrCreateOverlaysContainer } from "./utils";

const BUTTONS: Record<
  "accept" | "reject" | "customize" | "dialogAccept" | "save",
  ButtonSpec
> = {
  accept: {
    modifier: "accept",
    textId: "acceptButtonText",
    cc: "accept",
    toolbar: toolbarAcceptButton,
    sidebar: sidebarAcceptButton
  },
  reject: {
    modifier: "reject",
    textId: "rejectButtonText",
    cc: "reject",
    toolbar: toolbarRejectButton,
    sidebar: sidebarRejectButton
  },
  customize: {
    modifier: "customize",
    textId: "customizeButtonText",
    cc: "customize",
    toolbar: toolbarCustomizeButton,
    sidebar: sidebarCustomizeButton
  },
  dialogAccept: {
    modifier: "dialog-accept",
    textId: "dialogAcceptButtonText",
    cc: "accept",
    toolbar: toolbarDialogAcceptButton,
    sidebar: sidebarDialogAcceptButton
  },
  save: {
    modifier: "save",
    textId: "saveButtonText",
    cc: "save",
    toolbar: toolbarSaveButton,
    sidebar: sidebarSaveButton
  }
};

const BUTTON_TOOLBARS = Object.values(BUTTONS).map(({ toolbar }) => toolbar);
const BUTTON_SIDEBARS = Object.values(BUTTONS).map(({ sidebar }) => sidebar);

class CookieBanner extends EditorComponent<Value, Props> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.CookieBanner {
    return ElementTypes.CookieBanner;
  }

  overlaysContainer: HTMLElement | null = null;
  el: HTMLDivElement | null = null;

  componentDidMount(): void {
    // #brz-overlays is a sibling rendered by GlobalBlocksOverlays; a child's
    // constructor runs before the parent's render is committed to the DOM, so
    // the container can only be looked up once mounting has happened (React
    // commits the whole tree before any componentDidMount runs). forceUpdate
    // is needed because setting `this.el` alone doesn't trigger a re-render.
    if (isEditor(this.props.renderContext)) {
      this.overlaysContainer = getOrCreateOverlaysContainer();
      this.el = document.createElement("div");
      this.overlaysContainer.appendChild(this.el);
      this.forceUpdate();
    }
  }

  componentWillUnmount(): void {
    if (this.overlaysContainer && this.el) {
      this.overlaysContainer.removeChild(this.el);
      this.overlaysContainer = null;
      this.el = null;
    }

    super.componentWillUnmount();
  }

  handleTextChange = (patch: { [k: string]: string }): void => {
    this.patchValue(patch);
  };

  // In the editor the button element is the toolbar's own node, so a click on it
  // opens that button's toolbar instead of the container one.
  renderButton(v: Value, spec: ButtonSpec): ReactElement {
    const { modifier, textId, cc, toolbar, sidebar } = spec;

    const className = classnames(
      "brz-cookie-banner__btn",
      `brz-cookie-banner__btn--${modifier}`
    );

    const renderNode = (
      // The toolbar render prop types its ref for a <div>; these are <button>
      // elements, so it is attached through their common HTMLElement supertype.
      ref: RefObject<HTMLDivElement> | null
    ): ReactElement => (
      <button
        type="button"
        className={className}
        {...makeDataAttr({ name: "cc", value: cc })}
        ref={(el): void => attachRef<HTMLElement>(el, ref)}
      >
        <Text id={textId} v={v} onChange={this.handleTextChange} />
      </button>
    );

    if (!isEditor(this.props.renderContext)) {
      return renderNode(null);
    }

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbar, sidebar, {
          allowExtend: false
        })}
      >
        {({ ref }): ReactElement => renderNode(ref)}
      </Toolbar>
    );
  }

  renderBar(v: Value, hidden: boolean): ReactElement {
    const itemsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: { meta: this.props.meta }
    });

    const className = classnames("brz-cookie-banner__bar", {
      "brz-hidden": hidden
    });

    return (
      <div
        className={className}
        {...makeDataAttr({ name: "cc", value: "banner" })}
      >
        <div className="brz-cookie-banner__text">
          {/* @ts-expect-error: EditorArrayComponent is still in JS, TS cannot read its return type */}
          <EditorArrayComponent {...itemsProps} />
        </div>
        <div className="brz-cookie-banner__buttons">
          {this.renderButton(v, BUTTONS.accept)}
          {this.renderButton(v, BUTTONS.reject)}
          {this.renderButton(v, BUTTONS.customize)}
        </div>
      </div>
    );
  }

  renderBadge(hidden?: boolean): ReactElement {
    const className = classnames("brz-cookie-banner__badge", {
      "brz-hidden": hidden
    });

    return (
      <div
        className={className}
        {...makeDataAttr({ name: "cc", value: "badge" })}
      >
        <Cookie className="brz-cookie-banner__badge-icon" aria-hidden="true" />
      </div>
    );
  }

  renderDialog(v: Value, hidden?: boolean): ReactElement {
    const className = classnames("brz-cookie-banner__backdrop", {
      "brz-hidden": hidden
    });

    return (
      <div
        className={className}
        {...makeDataAttr({ name: "cc", value: "backdrop" })}
      >
        <div
          className="brz-cookie-banner__dialog"
          {...makeDataAttr({ name: "cc", value: "dialog" })}
        >
          <h3 className="brz-cookie-banner__dialog-title">
            {t("Cookie preferences")}
          </h3>
          <div className="brz-cookie-banner__dialog-body">
            {getCategories().map(({ key, label, description, locked }) => (
              <div className="brz-cookie-banner__category" key={key}>
                <p className="brz-cookie-banner__category-label">{label}</p>
                <p className="brz-cookie-banner__category-description">
                  {description}
                </p>
                <label className="brz-cookie-banner__switch">
                  <input
                    type="checkbox"
                    className="brz-cookie-banner__switch-input"
                    {...makeDataAttr({ name: "cc", value: "category-toggle" })}
                    {...makeDataAttr({ name: "cc-category", value: key })}
                    defaultChecked={locked}
                    disabled={locked}
                  />
                  <span className="brz-cookie-banner__switch-slider" />
                </label>
              </div>
            ))}
          </div>
          <div className="brz-cookie-banner__dialog-footer">
            {this.renderButton(v, BUTTONS.dialogAccept)}
            {this.renderButton(v, BUTTONS.save)}
          </div>
        </div>
      </div>
    );
  }

  renderForEdit(v: Value): ReactElement | null {
    if (!this.el) {
      return null;
    }

    const el = this.el;

    const className = this.getCSSClassnames({
      toolbars: [toolbarConfig, ...BUTTON_TOOLBARS],
      sidebars: [sidebarConfig, ...BUTTON_SIDEBARS],
      extraClassNames: ["brz-cookie-banner"]
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
        selector=".brz-cookie-banner__bar, .brz-cookie-banner__badge, .brz-cookie-banner__dialog"
      >
        {({ ref }) =>
          ReactDOM.createPortal(
            <div className={className} id={this.getId()} ref={ref}>
              {v.currentView === "banner" && this.renderBar(v, false)}
              {v.currentView === "badge" && this.renderBadge()}
              {v.currentView === "preferences" && this.renderDialog(v)}
            </div>,
            el
          )
        }
      </Toolbar>
    );
  }

  renderForView(v: Value): ReactElement {
    const className = this.getCSSClassnames({
      toolbars: [toolbarConfig, ...BUTTON_TOOLBARS],
      sidebars: [sidebarConfig, ...BUTTON_SIDEBARS],
      extraClassNames: ["brz-cookie-banner"]
    });

    return (
      <div className={className} id={this.getId()}>
        {/* all three start hidden: export.ts reads the stored choice and
            reveals the bar or the badge, so neither flashes on reload */}
        {this.renderBar(v, true)}
        {this.renderBadge(true)}
        {this.renderDialog(v, true)}
      </div>
    );
  }
}

export default CookieBanner;
