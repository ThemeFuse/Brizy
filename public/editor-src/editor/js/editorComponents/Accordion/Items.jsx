import React from "react";
import classnames from "classnames";
import Toolbar from "visual/component/Toolbar";
import { removeAt } from "timm";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { hideToolbar } from "visual/component/Toolbar/index";
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

  state = {
    visibleTag: "All"
  };

  tags = new Set();

  handleFilterClick(tag) {
    if (tag !== this.state.visibleTag) {
      this.setState({ visibleTag: tag });
    }
  }

  getItemProps(itemData, itemIndex, items) {
    const {
      meta,
      activeAccordionItem,
      navIcon,
      collapsible,
      animationClassName
    } = this.props;
    const { visibleTag } = this.state;

    const { tags = "" } = itemData.value;
    let tag = this.updateTags(tags);

    const className = classnames("brz-accordion__item", tag, {
      "brz-accordion__item--active": activeAccordionItem === itemIndex,
      "brz-accordion__hidden": !(
        visibleTag === "All" || tag.includes(visibleTag)
      )
    });
    const cloneRemoveConfig = {
      getItems: () => [
        {
          id: "duplicate",
          type: "button",
          devices: "desktop",
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
          devices: "desktop",
          icon: "nc-trash",
          title: t("Delete"),
          position: 210,
          disabled: items.length === 1,
          onChange: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ]
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(cloneRemoveConfig);

    return {
      meta,
      className,
      activeAccordionItem: activeAccordionItem === itemIndex,
      navIcon,
      collapsible,
      animationClassName,
      toolbarExtend,
      tag,
      visibleTag: this.state.visibleTag,
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

  getTags(tags = "") {
    if (!tags) {
      return [];
    }

    return tags.split(",").reduce((acc, curr) => {
      const tag = curr.trim();
      return tag ? [...acc, tag.replace(/\s/g, "-")] : acc;
    }, []);
  }

  updateTags(_tags) {
    const tags = this.getTags(_tags);

    if (tags.length) {
      tags.forEach(t => {
        this.tags.add(t);
      });
    }

    return tags;
  }

  updateItem(itemIndex, itemValue, updateMeta = {}) {
    super.updateItem(itemIndex, itemValue, updateMeta);
    this.tags.clear();
    this.updateTags(itemValue.tag);
  }

  renderTags() {
    const tags = ["All", ...this.tags];
    const { toolbarExtendFilter, filterStyle } = this.props;
    const filterClassName = classnames(
      "brz-accordion__filter",
      `brz-accordion__filter--${filterStyle}`
    );
    const className = classnames(
      "brz-li brz-accordion__filter__item",
      `brz-accordion__filter__item--${filterStyle}`
    );

    return (
      <div className="brz-accordion__filter-wrapper">
        <ul className={`brz-ul ${filterClassName}`}>
          {tags.map((tag, index) => {
            return (
              <Toolbar {...toolbarExtendFilter} key={index}>
                <li
                  className={
                    className +
                    `${
                      this.state.visibleTag === tag
                        ? " brz-accordion__filter__item--active"
                        : ""
                    }`
                  }
                  data-filter={tag === "All" ? "*" : tag}
                  onClick={() => {
                    this.handleFilterClick(tag);
                  }}
                >
                  {tag}
                </li>
              </Toolbar>
            );
          })}
        </ul>
      </div>
    );
  }

  removeItem(itemIndex) {
    const dbValue = this.getDBValue() || [];
    const updatedValue = removeAt(dbValue, itemIndex);

    this.handleAccordionActive(0);

    setTimeout(() => {
      this.handleValueChange(updatedValue, { arrayOperation: "remove" });
    }, 0);
  }

  renderItemsContainer(items) {
    const { className, style, enableTags } = this.props;

    return (
      <div className={className} style={style}>
        {enableTags === "on" && this.tags.size > 0 && this.renderTags()}
        {items}
      </div>
    );
  }
}

export default AccordionItems;
