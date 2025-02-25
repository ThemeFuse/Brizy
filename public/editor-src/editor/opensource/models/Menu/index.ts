export interface MenuItem {
  type: "MenuItem";
  value: {
    id: string;
    title: string;
    url: string;
    target?: string;
    classes?: Array<string>;

    // For Dropdown next level
    items?: Array<MenuItem>;
  };
}

export type Menu = Array<{
  id: string;
  name: string;
  items: Array<MenuItem>;
}>;
