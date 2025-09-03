import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import UIEvents from "visual/global/UIEvents";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { AnimatedHamburgerIcon } from "../../HamburgerIcon";
import { MMenuAnimationTypes } from "../../types";

interface Props {
  onOpen?: VoidFunction;
  animation: MMenuAnimationTypes;
  size: number;
  mobileSize?: number;
  tabletSize?: number;
}

export const HamburgerIcon: FC<Props> = ({
  animation,
  size,
  onOpen,
  mobileSize,
  tabletSize
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<AnimatedHamburgerIcon | null>(null);

  const sizes = useMemo(
    () => ({
      desktop: size,
      tablet: tabletSize ?? size,
      mobile: mobileSize ?? size
    }),
    [size, tabletSize, mobileSize]
  );

  const handleCloseMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpenMenu = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  useEffect(() => {
    UIEvents.on("mMenu:close", handleCloseMenu);

    if (ref.current && !burgerRef.current) {
      burgerRef.current = new AnimatedHamburgerIcon(ref.current, {
        animation,
        onOpen: handleOpenMenu
      });
    }

    return () => {
      UIEvents.off("mMenu:close", handleCloseMenu);
      burgerRef.current?.destroy();
      burgerRef.current = null;
    };
  }, [animation, handleCloseMenu, handleOpenMenu]);

  useEffect(() => {
    if (burgerRef.current) {
      burgerRef.current.reinit();
    }
  }, [sizes]);

  useEffect(() => {
    if (burgerRef.current) {
      if (isOpen !== burgerRef.current.getToggled()) {
        burgerRef.current.toggle();
      }
    }
  }, [isOpen]);

  const attr = makeDataAttr({
    name: "brz-mmenu-icon",
    value: animation
  });

  return <div className="brz-mm-menu__icon" ref={ref} {...attr} />;
};
