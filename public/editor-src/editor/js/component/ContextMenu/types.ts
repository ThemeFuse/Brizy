export interface Item {
  id: string;
  type: string;
  items?: Item[];
  disabled?: boolean | ((item: Item, meta: Meta) => boolean);
}

export interface Meta {
  depth?: number;
  isInSubMenu: boolean;
}
