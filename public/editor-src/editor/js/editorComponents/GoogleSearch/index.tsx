import React, {
  ChangeEvent,
  MouseEvent,
  createElement,
  createRef
} from "react";
import CustomCSS from "visual/component/CustomCSS";
import { ThemeIcon } from "visual/component/ThemeIcon";
import Toolbar from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { t } from "visual/utils/i18n";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { attachRefs } from "visual/utils/react";
import { Wrapper } from "../tools/Wrapper";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import * as toolbarConfig from "./toolbar";
import { Value } from "./types";
import { isValidEngineId } from "./utils";

const CSE_URL = "https://programmablesearchengine.google.com/controlpanel/all";
const GSC_URL = "https://search.google.com/search-console";

class GoogleSearch extends EditorComponent<Value> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.GoogleSearch {
    return ElementTypes.GoogleSearch;
  }

  inputRef = createRef<HTMLInputElement>();

  handleInputChange = (e: ChangeEvent<HTMLInputElement>): void =>
    this.patchValue({
      label: e.target.value
    });

  handleInputClick = (e: MouseEvent<HTMLInputElement>): void => {
    e.preventDefault();

    this.inputRef.current?.classList.add("brz-ed-dd-cancel");
  };

  handleInputBlur = (): void => {
    this.inputRef.current?.classList.remove("brz-ed-dd-cancel");
  };

  renderButton() {
    const buttonsProps = this.makeSubcomponentProps({
      bindWithKey: "items",
      itemProps: {
        meta: {
          ...this.props.meta,
          showBorderRadius: true
        }
      }
    });

    // @ts-expect-error: EditorArrayComponent is still in .js
    return <EditorArrayComponent {...buttonsProps} />;
  }

  renderIcon() {
    return (
      <ThemeIcon
        className="brz-google-search-icon__style1"
        type="editor"
        name="search"
      />
    );
  }

  renderSetupGuide(): JSX.Element {
    return (
      <div className="brz-google-search-setup">
        <div className="brz-google-search-setup__header">
          <ThemeIcon
            className="brz-google-search-setup__icon"
            type="editor"
            name="search"
          />
          <span className="brz-google-search-setup__title">
            {t("Google Search Setup Required")}
          </span>
        </div>

        <div className="brz-google-search-setup__steps">
          <div className="brz-google-search-setup__step">
            <span className="brz-google-search-setup__step-number">1</span>
            <div className="brz-google-search-setup__step-content">
              <strong>{t("Create a Search Engine")}</strong>
              <p>
                {t(
                  "Go to Google Programmable Search Engine, select your project and copy the Search Engine ID. Then paste it in the toolbar settings of this element."
                )}
              </p>
              <a
                href={CSE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="brz-google-search-setup__link"
              >
                {t("Open CSE Console")} &rarr;
              </a>
            </div>
          </div>

          <div className="brz-google-search-setup__step">
            <span className="brz-google-search-setup__step-number">2</span>
            <div className="brz-google-search-setup__step-content">
              <strong>{t("Configure Layout")}</strong>
              <p>
                {t(
                  'In your CSE settings, go to Look and Feel > Layout and select "Results only" for the component to work correctly.'
                )}
              </p>
            </div>
          </div>

          <div className="brz-google-search-setup__step">
            <span className="brz-google-search-setup__step-number">3</span>
            <div className="brz-google-search-setup__step-content">
              <strong>{t("Index Your Website")}</strong>
              <p>
                {t(
                  "Go to Google Search Console and verify your domain ownership by adding a DNS record through your domain provider. Google CSE only works on custom domains that are indexed by Google."
                )}
              </p>
              <a
                href={GSC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="brz-google-search-setup__link"
              >
                {t("Open Search Console")} &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderForEdit(v: Value): JSX.Element {
    const { customCSS, label, searchStyle, engineId } = v;

    const hasEngineId = !!engineId;
    const isValid = hasEngineId && isValidEngineId(engineId);

    const className = this.getCSSClassnames({
      toolbars: [toolbarConfig],
      sidebars: [sidebarConfig],
      extraClassNames: [
        "brz-google-search-container",
        `brz-google-search-container--${searchStyle}`
      ]
    });

    const showSetup = !hasEngineId;
    const showError = hasEngineId && !isValid;

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
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
                {showSetup ? (
                  this.renderSetupGuide()
                ) : (
                    <form
                      className="brz-form brz-google-search-form"
                      noValidate
                    >
                      {searchStyle !== "classic" && this.renderIcon()}
                      <input
                        name="search"
                        ref={this.inputRef}
                        className="brz-input brz-google-search"
                        autoComplete="off"
                        value={label}
                        onChange={this.handleInputChange}
                        onClick={this.handleInputClick}
                        onBlur={this.handleInputBlur}
                      />
                      {searchStyle === "classic" && this.renderButton()}
                    </form>
                )}
                {showError && (
                  <div className="brz-google-search-setup__error">
                    {t(
                      'Invalid Search Engine ID format. The ID should contain only letters, numbers, colons and hyphens (e.g. "012345678901234567890:abcdefghij").'
                    )}
                  </div>
                )}
              </Wrapper>
            )}
          </CustomCSS>
        )}
      </Toolbar>
    );
  }

  renderForView(v: Value): JSX.Element {
    const { customCSS, label, searchStyle, engineId } = v;

    const gname = this.getId();

    const className = this.getCSSClassnames({
      toolbars: [toolbarConfig],
      sidebars: [sidebarConfig],
      extraClassNames: [
        "brz-google-search-container",
        `brz-google-search-container--${searchStyle}`
      ]
    });

    if (!isValidEngineId(engineId)) {
      return <></>;
    }

    const dataAttrs = {
      ...makeDataAttr({ name: "gname", value: gname }),
      ...makeDataAttr({ name: "cx", value: engineId })
    };

    return (
      <CustomCSS selectorName={this.getId()} css={customCSS}>
        <>
          <Wrapper
            {...this.makeWrapperProps({
              className
            })}
          >
            <form className="brz-form brz-google-search-form" {...dataAttrs}>
              <label
                htmlFor="google-search-field"
                className="brz-google-search-label-hidden"
              >
                {label}
              </label>
              {searchStyle !== "classic" && this.renderIcon()}
              <input
                name="search"
                id="google-search-field"
                className="brz-input brz-google-search"
                placeholder={label}
              />
              {searchStyle === "classic" && this.renderButton()}
            </form>
          </Wrapper>
          <div className="brz-google-search-results">
            {createElement("gcse:searchresults-only", { gname })}
          </div>
        </>
      </CustomCSS>
    );
  }
}

export default GoogleSearch;
