import classNames from "classnames";
import React, { ReactElement, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LeftSidebarOptionsIds } from "visual/global/Config/types/configs/ConfigCommon";
import { updateUI } from "visual/redux/actions2";
import { leftSidebarSelector } from "visual/redux/selectors";
import { DrawerContentTypes } from "visual/redux/types";
import { t } from "visual/utils/i18n";
import Link from "../Options/types/Link";

interface Props {
  icon?: string;
  onOpen?: (r: VoidFunction) => void;
  onClose?: VoidFunction;
  id: string;
  href?: string;
  title?: string;
}

const Component = (props: Props): ReactElement => {
  const { icon, onOpen, onClose, id, href, title } = props;
  const leftSidebar = useSelector(leftSidebarSelector);
  const mountedRef = useRef(false);
  const opened = leftSidebar.drawerContentType === id;
  const dispatch = useDispatch();

  const update = useCallback(
    (isOpen: boolean) => {
      dispatch(
        updateUI("leftSidebar", {
          drawerContentType: isOpen ? (id as DrawerContentTypes) : null
        })
      );
    },
    [dispatch, id]
  );

  const onLinkClick = useCallback((): void => {
    update(!opened);

    const onClose = () => {
      update(false);
    };

    onOpen?.(onClose);
  }, [onOpen, opened, update]);

  useEffect(() => {
    if (!opened && mountedRef.current) {
      onClose?.();
    }

    mountedRef.current = true;
  }, [opened, onClose]);

  return (
    <Link
      className={classNames("brz-ed-sidebar__control__item", {
        "brz-ed-sidebar__control__item--active": opened
      })}
      icon={icon ?? "nc-menu"}
      title={title ?? t("CMS")}
      onClick={onLinkClick}
      link={href}
    />
  );
};

export const custom = (option?: Props) => ({
  id: LeftSidebarOptionsIds.custom,
  type: "custom",
  Component: () => (
    <Component
      icon={option?.icon}
      onOpen={option?.onOpen}
      onClose={option?.onClose}
      id={option?.id ?? ""}
      href={option?.href}
      title={option?.title}
    />
  )
});
