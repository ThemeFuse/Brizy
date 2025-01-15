import React, { JSX, createRef } from "react";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { EcwidService } from "visual/libs/Ecwid";
import { eq } from "visual/libs/Ecwid/types/EcwidConfig";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { encodeToString } from "visual/utils/string";
import { uuidWithPlaceholderUuid } from "visual/utils/uuid";
import type { MValue } from "visual/utils/value";
import * as sidebarExtendParent from "../sidebar";
import * as sidebarDisable from "../sidebarDisable";
import { ecwidToolbarFooter } from "../toolbarFooter";
import { ecwidToolbarTitle } from "../toolbarTitle";
import { ecwidToolbarTitle2 } from "../toolbarTitle2";
import { footerCssData, title2CssData, titleCssData } from "./css";
import defaultValue from "./defaultValue.json";
import * as sidebarButton from "./sidebarButton";
import * as sidebarImage from "./sidebarImage";
import * as toolbarExtendParent from "./toolbar";
import * as toolbarButton from "./toolbarButton";
import * as toolbarImage from "./toolbarImage";
import * as toolbarPrice from "./toolbarPrice";
import * as toolbarTitleEmpty from "./toolbarTitleEmpty";
import type { Value } from "./types";
import { containsNode, valueToEciwdConfig } from "./utils";

export class EcwidFavorites extends EditorComponent<Value> {
  static get componentId(): ElementTypes.EcwidFavorites {
    return ElementTypes.EcwidFavorites;
  }

  static defaultValue = defaultValue;

  private ecwid: MValue<EcwidService>;

  private uniqueId = `${
    EcwidFavorites.componentId
  }-${uuidWithPlaceholderUuid()}`;

  private containerRef = createRef<HTMLDivElement>();

  componentDidMount(): void {
    const toolbarExtend = this.makeToolbarPropsFromConfig2(
      toolbarExtendParent,
      sidebarExtendParent,
      {
        allowExtend: false,
        allowExtendFromThirdParty: true,
        thirdPartyExtendId: `${this.getComponentId()}Parent`
      }
    );
    this.props.extendParentToolbar(toolbarExtend);

    const config = this.getGlobalConfig();
    const storeId = config?.modules?.shop?.storeId;

    if (this.containerRef.current && storeId) {
      const v = this.getValue();
      const cnf = valueToEciwdConfig(v);

      this.ecwid = EcwidService.init(storeId, { ...cnf, redirect: undefined });
      this.ecwid.favorites(this.containerRef.current);
    }
  }

  componentDidUpdate(): void {
    const newConfig = valueToEciwdConfig(this.getValue());
    const oldConfig = this.ecwid?.getConfig();

    if (!oldConfig || !eq(oldConfig, newConfig)) {
      this.ecwid?.updateConfig(newConfig);
    }
  }

  renderForEdit(): JSX.Element {
    const className = this.getCSSClassnames({
      toolbars: [
        toolbarExtendParent,
        toolbarImage,
        toolbarPrice,
        toolbarButton,
        toolbarTitleEmpty,
        ecwidToolbarTitle(titleCssData),
        ecwidToolbarTitle2(title2CssData),
        ecwidToolbarFooter(footerCssData)
      ],
      sidebars: [sidebarImage, sidebarButton],
      extraClassNames: ["brz-ecwid-wrapper", "brz-ecwid-favorites-wrapper"]
    });

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(
          ecwidToolbarTitle(),
          sidebarDisable
        )}
        selector=".page-title__name.ec-header-h1"
        selectorSearchStrategy="dom-tree"
      >
        {({ open: openTitle }) => {
          return (
            <Toolbar
              {...this.makeToolbarPropsFromConfig2(
                toolbarTitleEmpty,
                sidebarDisable
              )}
              selector=".ec-store__favorites-page--empty .ec-page-body"
              selectorSearchStrategy="dom-tree"
            >
              {({ open: openTitleEmpty }) => {
                return (
                  <Toolbar
                    {...this.makeToolbarPropsFromConfig2(
                      ecwidToolbarFooter(),
                      sidebarDisable
                    )}
                    selector=".ec-footer__row"
                    selectorSearchStrategy="dom-tree"
                  >
                    {({ open: openFooter }) => {
                      return (
                        <Toolbar
                          {...this.makeToolbarPropsFromConfig2(
                            toolbarImage,
                            sidebarImage,
                            { allowExtend: false }
                          )}
                          selector=".grid-product__image"
                          selectorSearchStrategy="dom-tree"
                        >
                          {({ open: openImage }) => {
                            return (
                              <Toolbar
                                {...this.makeToolbarPropsFromConfig2(
                                  ecwidToolbarTitle2(),
                                  sidebarDisable,
                                  { allowExtend: false }
                                )}
                                selector=".grid-product__title"
                                selectorSearchStrategy="dom-tree"
                              >
                                {({ open: openTitle2 }) => {
                                  return (
                                    <Toolbar
                                      {...this.makeToolbarPropsFromConfig2(
                                        toolbarPrice,
                                        sidebarDisable,
                                        { allowExtend: false }
                                      )}
                                      selector=".grid-product__price-value"
                                      selectorSearchStrategy="dom-tree"
                                    >
                                      {({ open: openPrice }) => {
                                        return (
                                          <Toolbar
                                            {...this.makeToolbarPropsFromConfig2(
                                              toolbarButton,
                                              sidebarButton,
                                              { allowExtend: false }
                                            )}
                                            selector=".favorite-product__button-saved"
                                            selectorSearchStrategy="dom-tree"
                                          >
                                            {({ open: openButton }) => {
                                              return (
                                                <Wrapper
                                                  {...this.makeWrapperProps({
                                                    className
                                                  })}
                                                >
                                                  <div
                                                    className="brz-ecwid-favorites"
                                                    id={this.uniqueId}
                                                    ref={this.containerRef}
                                                    onClickCapture={(e) => {
                                                      e.stopPropagation();
                                                      e.preventDefault();

                                                      if (
                                                        containsNode(
                                                          e,
                                                          ".page-title__name.ec-header-h1"
                                                        )
                                                      ) {
                                                        openTitle(
                                                          e.nativeEvent
                                                        );
                                                      } else if (
                                                        containsNode(
                                                          e,
                                                          ".ec-footer__row"
                                                        )
                                                      ) {
                                                        openFooter(
                                                          e.nativeEvent
                                                        );
                                                      } else if (
                                                        containsNode(
                                                          e,
                                                          ".grid-product__image"
                                                        )
                                                      ) {
                                                        openImage(
                                                          e.nativeEvent
                                                        );
                                                      } else if (
                                                        containsNode(
                                                          e,
                                                          ".grid-product__title"
                                                        )
                                                      ) {
                                                        openTitle2(
                                                          e.nativeEvent
                                                        );
                                                      } else if (
                                                        containsNode(
                                                          e,
                                                          ".grid-product__price-value"
                                                        )
                                                      ) {
                                                        openPrice(
                                                          e.nativeEvent
                                                        );
                                                      } else if (
                                                        containsNode(
                                                          e,
                                                          ".favorite-product__button-saved"
                                                        )
                                                      ) {
                                                        openButton(
                                                          e.nativeEvent
                                                        );
                                                      } else if (
                                                        containsNode(
                                                          e,
                                                          ".ec-store__favorites-page--empty .ec-page-body"
                                                        )
                                                      ) {
                                                        openTitleEmpty(
                                                          e.nativeEvent
                                                        );
                                                      }
                                                    }}
                                                  />
                                                </Wrapper>
                                              );
                                            }}
                                          </Toolbar>
                                        );
                                      }}
                                    </Toolbar>
                                  );
                                }}
                              </Toolbar>
                            );
                          }}
                        </Toolbar>
                      );
                    }}
                  </Toolbar>
                );
              }}
            </Toolbar>
          );
        }}
      </Toolbar>
    );
  }

  renderForView(v: Value): JSX.Element {
    const cnf = valueToEciwdConfig(v);

    const className = this.getCSSClassnames({
      toolbars: [
        toolbarExtendParent,
        toolbarImage,
        toolbarPrice,
        toolbarButton,
        toolbarTitleEmpty,
        ecwidToolbarTitle(titleCssData),
        ecwidToolbarTitle2(title2CssData),
        ecwidToolbarFooter(footerCssData)
      ],
      sidebars: [sidebarImage, sidebarButton],
      extraClassNames: ["brz-ecwid-wrapper", "brz-ecwid-favorites-wrapper"]
    });

    const storeId = makePlaceholder({
      content: "{{ecwid_store_id}}"
    });

    return (
      <Wrapper
        {...this.makeWrapperProps({
          className
        })}
      >
        <div
          className="brz-ecwid-favorites"
          data-store-id={storeId}
          data-storefront={encodeToString(cnf)}
        />
      </Wrapper>
    );
  }
}
