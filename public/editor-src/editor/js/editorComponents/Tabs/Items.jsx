import React from "react";
import classnames from "classnames";
import { mergeIn, removeAt } from "timm";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import ContainerBorder from "visual/component-new/ContainerBorder";
import Toolbar from "visual/component-new/Toolbar";
import TextEditor from "visual/editorComponents/Text/Editor";
import { hideToolbar } from "visual/component-new/Toolbar/index";
import { t } from "visual/utils/i18n";

class TabsItems extends EditorArrayComponent {
  static get componentId() {
    return "Tabs.Items";
  }

  static defaultProps = {
    className: "",
    style: {},
    meta: {}
  };

  getItemProps() {
    const { meta } = this.props;

    return { meta };
  }

  handleTabActive = key => {
    const { activeTab, handleNav: onChange } = this.props;

    if (activeTab !== key) {
      onChange(key);
    }
  };

  handleNavChange = (value, index) => {
    if (value === undefined) {
      this.removeItem(index);
    } else {
      const dbValue = this.getDBValue();
      const updatedValue = mergeIn(dbValue, [index, "value"], {
        labelText: value
      });

      this.handleValueChange(updatedValue, {
        arrayOperation: "itemChange"
      });
    }
  };

  handleToolbarEnter = () => {
    this.containerBorder.setParentsHover(true);
  };
  handleToolbarLeave = () => {
    this.containerBorder.setParentsHover(false);
  };

  removeItem(itemIndex) {
    const dbValue = this.getDBValue() || [];
    const updatedValue = removeAt(dbValue, itemIndex);

    this.handleTabActive(0);

    setTimeout(() => {
      this.handleValueChange(updatedValue, { arrayOperation: "remove" });
    }, 0);
  }

  renderNav() {
    const items = this.getValue();
    const { activeTab } = this.props;

    const navItems = items.map((el, index) => {
      const { labelText, _id } = el.value;
      const className = classnames(
        "brz-tabs__nav--item brz-tabs__nav--desktop",
        {
          "brz-tabs__nav--active": activeTab === index
        }
      );

      const cloneRemoveConfig = {
        getItemsForDesktop: () => [
          {
            id: "duplicate",
            type: "button",
            icon: "nc-duplicate",
            title: t("Duplicate"),
            position: 200,
            onChange: () => {
              this.cloneItem(index);
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
              this.removeItem(index);
            }
          }
        ],
        getItemsForTablet: () => [],
        getItemsForMobile: () => []
      };

      return (
        <li
          key={_id}
          className={className}
          onClick={() => {
            this.handleTabActive(index);
          }}
        >
          <Toolbar {...this.makeToolbarPropsFromConfig(cloneRemoveConfig)}>
            <div className="brz-tabs__nav--button">
              <TextEditor
                value={labelText}
                onChange={value => {
                  this.handleNavChange(value, index);
                }}
              />
            </div>
          </Toolbar>
        </li>
      );
    });

    let content = <ul className="brz-tabs__nav">{navItems}</ul>;

    if (IS_EDITOR) {
      content = (
        <ContainerBorder
          ref={el => {
            this.containerBorder = el;
          }}
          borderStyle="none"
          activeBorderStyle="none"
          reactToClick={false}
          showBorders={false}
          path={this.getPath()}
        >
          {content}
        </ContainerBorder>
      );
    }

    return content;
  }

  renderMobileNav(item, itemKey, itemIndex, itemData) {
    const { activeTab } = this.props;

    const className = classnames("brz-tabs__nav--mobile", {
      "brz-tabs__nav--mobile--active": activeTab === itemIndex
    });

    const { labelText } = itemData.value;

    const toolbarExtend = {
      getItemsForDesktop: () => [],
      getItemsForTablet: () => [],
      getItemsForMobile: () => []
    };

    return (
      <div
        className={className}
        onClick={() => {
          this.handleTabActive(itemIndex);
        }}
      >
        <Toolbar {...this.makeToolbarPropsFromConfig(toolbarExtend)}>
          <div className="brz-tabs__nav--button">{labelText}</div>
        </Toolbar>
      </div>
    );
  }

  renderItemWrapper(item, itemKey, itemIndex, itemData) {
    const { activeTab } = this.props;

    const className = classnames("brz-tabs__items", {
      "brz-tabs__items--active": activeTab === itemIndex
    });

    return (
      <div key={itemKey} className={className}>
        {this.renderMobileNav(item, itemKey, itemIndex, itemData)}
        <div className="brz-tabs__item--content">{item}</div>
      </div>
    );
  }

  renderItemsContainer(items) {
    const { className, style } = this.props;

    return (
      <div className={className} style={style}>
        {this.renderNav()}
        <div className="brz-tabs__content">{items}</div>
      </div>
    );
  }
}

export default TabsItems;
