import EditorArrayComponent from "visual/editorComponents/EditorArrayComponent";
import { ElementModel } from "visual/component/Elements/Types";
import { NewToolbarConfig } from "visual/editorComponents/EditorComponent/types";

class TableBodyItems extends EditorArrayComponent {
  static get componentId() {
    return "TableBody.Items";
  }

  getItemProps(
    itemData: ElementModel,
    itemIndex: number,
    items: ElementModel[]
  ) {
    const props = super.getItemProps(itemData, itemIndex, items);

    const cloneRemoveConfig: NewToolbarConfig<ElementModel> = {
      getItems: () => [
        {
          id: "order",
          type: "order",
          devices: "desktop",
          position: 105,
          roles: ["admin"],
          config: {
            align: "vertical",
            disable:
              itemIndex === 0
                ? "prev"
                : itemIndex === items.length - 1
                  ? "next"
                  : undefined,
            onChange: (v: string) => {
              switch (v) {
                case "prev": {
                  this.reorderItem(itemIndex, itemIndex - 1);
                  break;
                }
                case "next": {
                  this.reorderItem(itemIndex, itemIndex + 1);
                  break;
                }
              }
            }
          }
        }
      ]
    };

    const toolbarExtend = this.makeToolbarPropsFromConfig2(cloneRemoveConfig);

    return {
      ...props,
      toolbarExtend
    };
  }

  renderItemWrapper(item: JSX.Element): JSX.Element {
    return item;
  }
}

export default TableBodyItems;
