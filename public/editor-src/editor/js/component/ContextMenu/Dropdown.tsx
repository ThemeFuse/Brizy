import { Content, Root, Trigger } from "@radix-ui/react-context-menu";
import React, {
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef
} from "react";
import { createPortal } from "react-dom";
import Items from "./Items";
import type { Item, MenuPosition, Meta } from "./types";
import { useCloseOnIframeInteraction } from "./useCloseOnIframeInteraction";

interface Props {
  menuPosition: MenuPosition;
  getItems: () => Item[];
  itemsMeta: Meta;
  root: HTMLElement;
  onClose: () => void;
}

const TRIGGER_STYLE: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: 0,
  height: 0,
  pointerEvents: "none"
};

export const Dropdown = (props: Props): React.ReactElement | null => {
  const { menuPosition, getItems, itemsMeta, root, onClose } = props;
  const triggerRef = useRef<HTMLSpanElement>(null);
  const items = useMemo(() => getItems(), [getItems]);

  useEffect(() => {
    if (!triggerRef.current) return;

    triggerRef.current.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        clientX: menuPosition.x,
        clientY: menuPosition.y
      })
    );
  }, [menuPosition]);

  const handleOnContextMenu = useCallback<MouseEventHandler>((e) => {
    e.preventDefault();
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        onClose();
      }
    },
    [onClose]
  );

  useCloseOnIframeInteraction(onClose);

  if (!items?.length) {
    return null;
  }

  return createPortal(
    <Root onOpenChange={handleOpenChange} modal={false}>
      <Trigger asChild>
        <span ref={triggerRef} aria-hidden style={TRIGGER_STYLE} />
      </Trigger>
      <Content
        className="brz-ed-context-menu"
        onContextMenu={handleOnContextMenu}
      >
        <Items data={items} meta={itemsMeta} />
      </Content>
    </Root>,
    root
  );
};
