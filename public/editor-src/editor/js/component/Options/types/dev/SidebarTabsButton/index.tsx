import React, { useCallback } from "react";
import { Props as OptionProps } from "visual/component/Options/Type";
import { Button as Control } from "visual/component/Controls/Button";
import { WithConfig } from "visual/utils/options/attributes";
import { pipe } from "visual/utils/fp";
import { updateUI } from "visual/redux/actions2";
import { useDispatch, useSelector } from "react-redux";
import { uiSelector } from "visual/redux/selectors-new";
import { prop } from "visual/utils/object/get";

export interface Config {
  tabId: string;
  icon: string;
  text: string;
  align?: "left" | "center" | "right";
}

export interface Props extends OptionProps<undefined>, WithConfig<Config> {}

const selector = pipe(uiSelector, prop("rightSidebar"));

export const SidebarTabsButton: React.FC<Props> = ({ config }) => {
  const dispatch = useDispatch();
  const rightSidebar = useSelector(selector);
  const onClick = useCallback(
    pipe(
      () => config?.tabId,
      (activeTab) =>
        updateUI("rightSidebar", { ...rightSidebar, isOpen: true, activeTab }),
      dispatch
    ),
    [dispatch, rightSidebar]
  );

  return (
    <>
      <Control onClick={onClick} icon={config?.icon} align={config?.align}>
        {config?.text}
      </Control>
    </>
  );
};
