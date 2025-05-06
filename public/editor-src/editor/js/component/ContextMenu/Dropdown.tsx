import React, {
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";
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
}

export const Dropdown = (props: Props): ReactNode => {
  const { id, getItems, itemsMeta } = props;
  const [isOpen, setOpen] = useState(false);
  const oldItems = useRef<Item[]>([]);

  const items = useMemo(() => {
    if (isOpen) {
      oldItems.current = getItems();
      return oldItems.current;
    }

    return oldItems.current;
  }, [getItems, isOpen]);

  const handleOpen = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  if (typeof window === "undefined") {
    return;
  }

  return createPortal(
    <Menu
      onVisibilityChange={handleOpen}
      animation={false}
      disableBoundariesCheck={true}
      id={id}
      style={{ display: items.length > 0 ? "block" : "none" }}
    >
      <Items data={items} meta={itemsMeta} />
    </Menu>,
    window.parent.document.body
  );
};
