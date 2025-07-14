import React, { ReactNode, useState } from "react";
import { Menu } from "react-contexify";
import { createPortal } from "react-dom";
import Items from "./Items";

interface Meta {
  depth: number;
  isInSubMenu?: boolean;
}

interface Item {
  type: "button" | "group";
  disabled?: (m: Meta) => boolean;
}

export interface Props {
  id: string;
  getItems: () => Item[];
  itemsMeta: Meta;
  root: HTMLElement;
}

export const Dropdown = (props: Props): ReactNode => {
  const { id, getItems, itemsMeta, root } = props;
  const [isOpen, setOpen] = useState(false);

  const items = isOpen ? <Items data={getItems()} meta={itemsMeta} /> : null;

  return createPortal(
    <Menu
      onVisibilityChange={setOpen}
      animation={false}
      disableBoundariesCheck={true}
      id={id}
    >
      {items}
    </Menu>,
    root
  );
};
