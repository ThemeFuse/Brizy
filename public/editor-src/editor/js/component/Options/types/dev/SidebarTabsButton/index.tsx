import React, { useCallback } from "react";
import * as Option from "visual/component/Options/Type";
import { Button as Control } from "visual/component/Controls/Button";
import { WithConfig } from "visual/utils/options/attributes";
import { pipe } from "visual/utils/fp";
import { updateUI } from "visual/redux/actions2";
import { useDispatch, useSelector } from "react-redux";
import { uiSelector } from "visual/redux/selectors-new";
import { prop } from "visual/utils/object/get";
import { ElementModel } from "visual/component/Elements/Types";

export interface Config {
  tabId: string;
  icon: string;
  text: string;
  align?: "left" | "center" | "right";
}

export interface Props extends Option.Props<undefined>, WithConfig<Config> {}

const selector = pipe(uiSelector, prop("rightSidebar"));

export const SidebarTabsButton: React.FC<Props> &
  Option.OptionType<undefined> = ({ config }) => {
  const dispatch = useDispatch();
  const rightSidebar = useSelector(selector);
  const onClick = useCallback(
    pipe(
      () => config?.tabId,
      activeTab =>
        updateUI("rightSidebar", { ...rightSidebar, isOpen: true, activeTab }),
      dispatch
    ),
    [dispatch, rightSidebar]
  );

  return (
    <>
      <Control
        onClick={onClick}
        label={config?.text}
        icon={config?.icon}
        align={config?.align}
      />
    </>
  );
};

SidebarTabsButton.fromElementModel = (): undefined => undefined;
SidebarTabsButton.toElementModel = (): ElementModel => ({});

// @ts-expect-error: Variable 'defaultValue' implicitly has an 'any' type.
SidebarTabsButton.defaultValue = undefined;
