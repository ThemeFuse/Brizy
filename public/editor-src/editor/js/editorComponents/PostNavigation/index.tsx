import classNames from "classnames";
import React, { ReactNode } from "react";
import {
  PostNavigationEditor,
  PostNavigationPreview
} from "visual/component/BrizyBuilder";
import CustomCSS from "visual/component/CustomCSS";
import Toolbar from "visual/component/Toolbar";
import EditorComponent from "visual/editorComponents/EditorComponent";
import { Wrapper } from "visual/editorComponents/tools/Wrapper";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { t } from "visual/utils/i18n";
import defaultValue from "./defaultValue.json";
import * as sidebarConfig from "./sidebar";
import { style } from "./styles";
import * as toolbarConfig from "./toolbar";
import { Value } from "./types";

class PostNavigation extends EditorComponent<Value> {
  static defaultValue = defaultValue;

  static get componentId(): ElementTypes.PostNavigation {
    return ElementTypes.PostNavigation;
  }

  handleChangeNext = (nextLabel: string) => {
    this.patchValue({ nextLabel });
  };

  handleChangePrevious = (prevLabel: string) => {
    this.patchValue({ prevLabel });
  };

  renderForEdit(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classNames(
      "brz-post-navigation",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );
    const { showPost, showTitle, prevLabel, nextLabel } = v;

    return (
      <Toolbar
        {...this.makeToolbarPropsFromConfig2(toolbarConfig, sidebarConfig)}
      >
        <CustomCSS selectorName={this.getId()} css={v.customCss}>
          <Wrapper {...this.makeWrapperProps({ className })}>
            <PostNavigationEditor
              showPost={showPost === "on"}
              showTitle={showTitle === "on"}
              prevPostLabel={prevLabel}
              nextPostLabel={nextLabel}
              onChangeNextLabel={this.handleChangeNext}
              onChangePrevLabel={this.handleChangePrevious}
              prevPost={t("Previous post")}
              nextPost={t("Next post")}
            />
          </Wrapper>
        </CustomCSS>
      </Toolbar>
    );
  }

  renderForView(v: Value, vs: Value, vd: Value): ReactNode {
    const className = classNames(
      "brz-post-navigation",
      this.css(
        this.getComponentId(),
        this.getId(),
        style({
          v,
          vs,
          vd,
          store: this.getReduxStore(),
          renderContext: this.renderContext
        })
      )
    );

    const { showPost, showTitle, prevLabel, nextLabel } = v;

    const prevPostUrl = makePlaceholder({
      content: "{{collection_item_previous_url}}"
    });

    const nextPostUrl = makePlaceholder({
      content: "{{collection_item_next_url}}"
    });

    const prevPostTitle = makePlaceholder({
      content: "{{collection_item_previous_title}}"
    });

    const nextPostTitle = makePlaceholder({
      content: "{{collection_item_next_title}}"
    });

    return (
      <CustomCSS selectorName={this.getId()} css={v.customCss}>
        <Wrapper {...this.makeWrapperProps({ className })}>
          <PostNavigationPreview
            showPost={showPost === "on"}
            showTitle={showTitle === "on"}
            prevPost={prevPostTitle}
            nextPost={nextPostTitle}
            prevPostLabel={prevLabel}
            nextPostLabel={nextLabel}
            prevPostUrl={prevPostUrl}
            nextPostUrl={nextPostUrl}
          />
        </Wrapper>
      </CustomCSS>
    );
  }
}

export default PostNavigation;
