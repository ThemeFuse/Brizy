import classnames from "classnames";
import React from "react";
import { removeAt } from "timm";
import { TextEditor } from "visual/component/Controls/TextEditor";
import Toolbar from "visual/component/Toolbar";
import { hideToolbar } from "visual/component/Toolbar";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { t } from "visual/utils/i18n";
import { makeDataAttr } from "visual/utils/i18n/attribute";

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
    visibleTag: this.props.allTag
  };

  componentDidUpdate() {
    if (
      !this.getItemsTags(this.props.dbValue).size &&
      this.state.visibleTag !== this.props.allTag
    ) {
      this.setState({ visibleTag: this.props.allTag });
    }
  }

  getItemsTags = (dbValue) => {
    return dbValue.reduce((acc, cur) => {
      if (cur?.value?.tags) {
        this.getTags(cur.value.tags).forEach((tag) => acc.add(tag));
      }
      return acc;
    }, new Set());
  };

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
      animDuration,
      animationClassName,
      tagName,
      allTag
    } = this.props;

    const { tags = "" } = itemData.value;
    const tag = this.getTags(tags);

    const cloneRemoveConfig = {
      getItems: () => [
        {
          id: "order",
          type: "order",
          devices: "desktop",
          position: 105,
          roles: ["admin"],
          disabled: items.length < 2,
          config: {
            align: "vertical",
            disable:
              itemIndex === 0
                ? "prev"
                : itemIndex === items.length - 1
                  ? "next"
                  : undefined,
            onChange: (v) => {
              switch (v) {
                case "prev":
                  this.reorderItem(itemIndex, itemIndex - 1);
                  break;
                case "next":
                  this.reorderItem(itemIndex, itemIndex + 1);
                  break;
              }
            }
          }
        },
        {
          id: "duplicate",
          type: "button",
          devices: "desktop",
          config: {
            icon: "nc-duplicate",
            title: t("Duplicate"),
            reverseTheme: true
          },
          position: 200,
          onClick: () => {
            this.cloneItem(itemIndex);
          }
        },
        {
          id: "remove",
          type: "button",
          devices: "desktop",
          config: {
            icon: "nc-trash",
            title: t("Delete"),
            reverseTheme: true
          },
          position: 210,
          disabled: items.length === 1,
          onClick: () => {
            hideToolbar();
            this.removeItem(itemIndex);
          }
        }
      ]
    };
    const toolbarExtend = this.makeToolbarPropsFromConfig2(cloneRemoveConfig);

    return {
      meta,
      navIcon,
      tag,
      collapsible,
      animDuration,
      animationClassName,
      toolbarExtend,
      tagName,
      activeAccordionItem: activeAccordionItem === itemIndex,
      visibleTag: this.state.visibleTag,
      allTag,
      handleAccordion: () => {
        this.handleAccordionActive(itemIndex);
      }
    };
  }

  handleAccordionActive = (key) => {
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

  updateItem(itemIndex, itemValue, updateMeta = {}) {
    super.updateItem(itemIndex, itemValue, updateMeta);
  }

  handleMainTagChange = (allTag) => {
    const { handleAllTagChange } = this.props;

    handleAllTagChange(allTag);
    this.setState({ visibleTag: allTag });
  };

  renderTags() {
    const { allTag, toolbarExtendFilter, filterStyle, sortTags } = this.props;
    const initialTags = this.getItemsTags(this.props.dbValue);
    const _tags =
      sortTags === "on"
        ? [...initialTags].sort((a, b) => a.localeCompare(b))
        : initialTags;
    const tags = [allTag, ..._tags];
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
                {({ ref }) => (
                  <li
                    className={
                      className +
                      `${
                        this.state.visibleTag === tag
                          ? " brz-accordion__filter__item--active"
                          : ""
                      }`
                    }
                    {...makeDataAttr({
                      name: "filter",
                      value: tag === allTag ? "*" : tag
                    })}
                    onClick={() => {
                      this.handleFilterClick(tag);
                    }}
                    ref={ref}
                  >
                    {tag === allTag ? (
                      <TextEditor
                        value={allTag}
                        onChange={this.handleMainTagChange}
                      />
                    ) : (
                      tag
                    )}
                  </li>
                )}
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
    const { className, style, enableTags, animDuration, containerRef } =
      this.props;
    const tags = this.getItemsTags(this.props.dbValue);

    return (
      <div
        className={className}
        style={style}
        {...makeDataAttr({ name: "duration", value: animDuration * 1000 })}
        ref={containerRef}
      >
        {enableTags === "on" && tags.size > 0 && this.renderTags()}
        {items}
      </div>
    );
  }
}

export default AccordionItems;
