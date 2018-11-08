import React from "react";
import Editor from "visual/global/Editor";
import UIEvents from "visual/global/UIEvents";
import EditorIcon from "visual/component-new/EditorIcon";
import Sortable from "visual/component-new/Sortable";
import SortableElement from "visual/component-new/Sortable/SortableElement";
import { setIds } from "visual/utils/models";
import { t } from "visual/utils/i18n";

const sortableBlindZone = {
  left: 0,
  right: 328,
  top: 0,
  bottom: Infinity
};

class DrawerComponent extends React.Component {
  handleSortableSort = (data, type) => {
    const { from, to } = data;

    const shortcodes = Editor.getShortcodes();
    const { resolve } = shortcodes[type].filter(shortcode => !shortcode.hidden)[
      from.elementIndex
    ];
    const itemData = setIds(resolve);

    const toContainerPath = to.sortableNode
      .getAttribute("data-sortable-path")
      .split(".");
    const toContainerType = to.sortableNode.getAttribute("data-sortable-type");
    const toItemPath = [...toContainerPath, String(to.elementIndex)];

    // notify React to actually change state accordingly
    UIEvents.emit("dnd.sort", {
      from: {
        itemData,
        itemType: "addable"
      },
      to: {
        containerPath: toContainerPath,
        containerType: toContainerType,
        itemIndex: to.elementIndex,
        itemPath: toItemPath
      }
    });
  };

  renderIcons(shortcodes) {
    return shortcodes
      .filter(shortcode => !shortcode.hidden)
      .map(({ id, title, icon }) => (
        <SortableElement key={id} type="addable" subtype={id}>
          <div className="brz-ed-sidebar__add-elements__item">
            <div className="brz-ed-sidebar__add-elements__icon">
              <EditorIcon icon={icon} />
            </div>
            <span className="brz-span brz-ed-sidebar__add-elements__text">
              {title}
            </span>
            <div className="brz-ed-sidebar__add-elements__tooltip">{title}</div>
          </div>
        </SortableElement>
      ));
  }

  render() {
    const shortcodes = Editor.getShortcodes();

    return Object.keys(shortcodes).map((category, index, arr) => (
      <React.Fragment key={category}>
        <Sortable
          type="addable"
          blindZone={sortableBlindZone}
          onSort={data => {
            this.handleSortableSort(data, category);
          }}
        >
          <div
            className={`brz-ed-sidebar__add-elements brz-ed-sidebar__add-elements--${category}`}
          >
            {this.renderIcons(shortcodes[category])}
          </div>
        </Sortable>
        {arr.length - 1 !== index && (
          <hr className="brz-ed-sidebar__add-elements--separator" />
        )}
      </React.Fragment>
    ));
  }
}

export const AddElements = {
  id: "addElements",
  icon: "nc-add",
  drawerTitle: t("Add Elements"),
  showInDeviceModes: ["desktop"],
  drawerComponent: DrawerComponent
};
