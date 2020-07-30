import { noop } from "underscore";
import { removeAt } from "timm";
import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";

class SwitcherItems extends EditorArrayComponent {
  static get componentId() {
    return "Switcher.Items";
  }

  static defaultProps = {
    className: "",
    renderType: "",
    style: {},
    meta: {},
    onChangeNav: noop
  };

  getItemProps(itemData, itemIndex) {
    const {
      renderType,
      meta,
      activeTab,
      animationClassName,
      toolbarExtend,
      onChangeNav
    } = this.props;

    return {
      meta,
      renderType,
      animationClassName,
      toolbarExtend,
      active: itemIndex === activeTab,
      onChangeNav: () => {
        itemIndex !== activeTab && onChangeNav(itemIndex);
      }
    };
  }

  removeItem(itemIndex) {
    const dbValue = this.getDBValue() || [];
    const updatedValue = removeAt(dbValue, itemIndex);

    this.props.onChangeNav(0);

    setTimeout(() => {
      this.handleValueChange(updatedValue, { arrayOperation: "remove" });
    }, 0);
  }
}

export default SwitcherItems;
