import React, { Fragment } from "react";
import classnames from "classnames";
import EditorComponent from "visual/editorComponents/EditorComponent";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import CustomCSS from "visual/component/CustomCSS";
import ThemeIcon from "visual/component/ThemeIcon";
import Link from "visual/component/Link";
import Toolbar from "visual/component/Toolbar";
import { getStore } from "visual/redux/store";
import { globalBlocksSelector } from "visual/redux/selectors";
import * as toolbarConfig from "./toolbar";
import * as sidebarConfig from "./sidebar";
import { styleClassName, styleCSSVars } from "./styles";
import defaultValue from "./defaultValue.json";

class Icon extends EditorComponent {
  static get componentId() {
    return "Icon";
  }

  static defaultValue = defaultValue;

  renderPopups() {
    const popupsProps = this.makeSubcomponentProps({
      bindWithKey: "popups",
      itemProps: itemData => {
        let isGlobal = false;

        if (itemData.type === "GlobalBlock") {
          // TODO: some kind of error handling
          itemData = globalBlocksSelector(getStore().getState())[
            itemData.value.globalBlockId
          ].data;
          isGlobal = true;
        }

        const {
          blockId,
          value: { popupId }
        } = itemData;

        return {
          blockId,
          instanceKey: IS_EDITOR
            ? `${this.getId()}_${popupId}`
            : isGlobal
            ? `global_${popupId}`
            : popupId
        };
      }
    });

    return <EditorArrayComponent {...popupsProps} />;
  }

  renderForEdit(v) {
    const {
      type: iconType,
      name: iconName,
      linkType,
      linkAnchor,
      linkExternalBlank,
      linkExternalRel,
      linkExternalType,
      linkPopup,
      linkUpload,
      popups,
      actionClosePopup
    } = v;

    const hrefs = {
      anchor: linkAnchor,
      external: v[linkExternalType],
      popup: linkPopup,
      upload: linkUpload
    };

    let content = (
      <span className={styleClassName(v)}>
        <ThemeIcon name={iconName} type={iconType} />
      </span>
    );

    if (hrefs[linkType] !== "") {
      const className = classnames({
        "brz-popup2__action-close":
          linkType === "action" && actionClosePopup === "on"
      });

      content = (
        <Link
          type={linkType}
          href={hrefs[linkType]}
          target={linkExternalBlank}
          rel={linkExternalRel}
          className={className}
        >
          {content}
        </Link>
      );
    }

    const style = { ...styleCSSVars(v) };

    return (
      <Fragment>
        <CustomCSS selectorName={this.getId()} css={v.customCSS}>
          <div className="brz-icon__container" style={style}>
            <Toolbar
              {...this.makeToolbarPropsFromConfig(toolbarConfig, sidebarConfig)}
            >
              {content}
            </Toolbar>
          </div>
        </CustomCSS>
        {popups.length > 0 &&
          linkType === "popup" &&
          linkPopup !== "" &&
          this.renderPopups()}
      </Fragment>
    );
  }
}

export default Icon;
