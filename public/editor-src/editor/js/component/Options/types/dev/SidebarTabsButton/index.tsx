import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button as Control } from "visual/component/Controls/Button";
import { Props as OptionProps } from "visual/component/Options/Type";
import { updateUI } from "visual/redux/actions2";
import { uiSelector } from "visual/redux/selectors";
import { pipe } from "visual/utils/fp";
import { prop } from "visual/utils/object/get";
import { WithConfig } from "visual/utils/options/attributes";

export interface Config {
  tabId: string;
  icon: string;
  text: string;
  align?: "left" | "center" | "right";
}

export interface Props extends OptionProps<undefined>, WithConfig<Config> {}

const selector = pipe(uiSelector, prop("rightSidebar"));

export const SidebarTabsButton: React.FC<Props> = ({ config }) => {
  const { tabId, icon, align, text } = config ?? {};

  const dispatch = useDispatch();
  const rightSidebar = useSelector(selector);
  const onClick = useCallback(
    () =>
      pipe(
        () => tabId,
        (activeTab) =>
          updateUI("rightSidebar", {
            ...rightSidebar,
            isOpen: true,
            activeTab
          }),
        dispatch
      )(),
    [dispatch, rightSidebar, tabId]
  );

  return (
    <>
      <Control onClick={onClick} icon={icon} align={align}>
        {text}
      </Control>
    </>
  );
};
