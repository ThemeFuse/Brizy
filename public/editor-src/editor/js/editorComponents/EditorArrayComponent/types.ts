import type { ElementModel } from "visual/component/Elements/Types";
import type {
  Model,
  OnChangeMeta
} from "visual/editorComponents/EditorComponent/types";
import type { ToolbarPropsFromConfig } from "visual/editorComponents/EditorComponent/utils";

export type ArrayItem<M extends ElementModel = ElementModel> = {
  type: string;
  value: Model<M>;
};

export type ArrayMeta<M extends ElementModel = ElementModel> =
  OnChangeMeta<M> & {
    idOptions?: { keepExistingIds?: boolean };
  };

export type ItemProps = Record<string, unknown>;

export type GetItemProps<M extends ElementModel = ElementModel> = (
  itemData: ArrayItem<M>,
  itemIndex: number,
  items: ArrayItem<M>[]
) => ItemProps;

export interface ArrayProps<M extends ElementModel = ElementModel> {
  itemProps?: ItemProps | GetItemProps<M>;
  sliceStartIndex?: number;
  sliceEndIndex?: number;
}

export type ItemsToolbarOptions = ToolbarPropsFromConfig & {
  itemIndex: number;
};

export type AlignDirection = "increase" | "decrease";

export interface KeyDownMeta {
  keyName: string;
  id: string;
}
