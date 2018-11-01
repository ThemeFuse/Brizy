import React from "react";
import classnames from "classnames";
import { removeAt } from "timm";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { hideToolbar } from "visual/component-new/Toolbar/index";
import { t } from "visual/utils/i18n";

class AccordionItems extends EditorArrayComponent {
  static get componentId() {
    return "Accordion.Items";
  }

  static defaultProps = {
    className: "",
    activeAccordionItem: 0,
    style: {},
    meta: {}
  };

  getItemProps(itemData, itemIndex, items) {
    const { meta, activeAccordionItem } = this.props;
    const className = classnames("brz-accordion__item", {
      "brz-accordion__item--active": activeAccordionItem === itemIndex
    });
    const cloneRemoveConfig = {
      getItemsForDesktop: () => [
        {
          id: "duplicate",
          type: "button",
          icon: "nc-duplicate",
          title: t("Duplicate"),
          position: 200,
          onChange: () => {
            this.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          icon: "nc-trash",
          title: t("Delete"),
          position: 210,
          disabled: items.length === 1,
          onChange: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ],
      getItemsForTablet: () => [],
      getItemsForMobile: () => []
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig(cloneRemoveConfig);

    return {
      meta,
      className,
      toolbarExtend,
      handleAccordion: () => {
        this.handleAccordionActive(itemIndex);
      }
    };
  }

  handleAccordionActive = key => {
    const { activeAccordionItem, handleNav: onChange } = this.props;

    if (activeAccordionItem !== key) {
      onChange(key);
    }
  };

  removeItem(itemIndex) {
    const dbValue = this.getDBValue() || [];
    const updatedValue = removeAt(dbValue, itemIndex);

    this.handleAccordionActive(0);

    setTimeout(() => {
      this.handleValueChange(updatedValue, { arrayOperation: "remove" });
    }, 0);
  }

  renderItemsContainer(items) {
    const { className, style } = this.props;

    return (
      <div className={className} style={style}>
        {items}
      </div>
    );
  }
}

export default AccordionItems;
