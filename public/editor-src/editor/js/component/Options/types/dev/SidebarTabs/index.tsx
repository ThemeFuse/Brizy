import React, { ReactElement, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RightSidebarTabs as Control } from "visual/component/Controls/RightSidebarTabs";
import { Tab } from "visual/component/Controls/Tabs2/Tab";
import { getCurrentTooltip } from "visual/component/Controls/Tooltip";
import Options from "visual/component/Options";
import { Props as OptionProps } from "visual/component/Options/Type";
import { ToolbarItemType } from "visual/editorComponents/ToolbarItemType";
import { usePro } from "visual/global/hooks";
import { useConfig } from "visual/providers/ConfigProvider";
import { updateUI } from "visual/redux/actions2";
import { uiSelector } from "visual/redux/selectors";
import { WithClassName, WithId } from "visual/types/attributes";
import { always, pipe } from "visual/utils/fp";
import { prop } from "visual/utils/object/get";
import { Literal } from "visual/utils/types/Literal";
import { nextAlign } from "./utils";

export interface Tab {
  id: string;
  title: string;
}

type OptionTab = {
  title?: string;
  label?: string;
  position?: number;
  options?: ToolbarItemType[];
} & WithId<Literal> &
  WithClassName;

export interface Props extends OptionProps<undefined> {
  tabs: OptionTab[];
}

const selector = pipe(uiSelector, prop("rightSidebar"));

export const SidebarTabs = ({ tabs, toolbar }: Props): ReactElement => {
  const { alignment, lock, isOpen, activeTab, type } = useSelector(selector);
  const dispatch = useDispatch();
  const config = useConfig();

  const pro = usePro();

  const onLock = useCallback(
    () =>
      pipe(
        () => (lock ? undefined : "manual"),
        (lock) =>
          updateUI("rightSidebar", {
            alignment,
            isOpen,
            lock,
            activeTab,
            type
          }),
        dispatch
      )(),
    [dispatch, alignment, isOpen, lock, activeTab, type]
  );
  const onAlign = useCallback(
    () =>
      pipe(
        always(alignment),
        nextAlign,
        (alignment) =>
          updateUI("rightSidebar", {
            alignment,
            isOpen,
            lock,
            activeTab,
            type
          }),
        dispatch,
        () => {
          const tooltip = getCurrentTooltip();
          tooltip?.close();
        }
      )(),
    [dispatch, alignment, isOpen, lock, activeTab, type]
  );
  const onChange = useCallback(
    (x0: Literal) =>
      pipe(
        (activeTab: Literal) =>
          updateUI("rightSidebar", {
            alignment,
            isOpen,
            lock,
            activeTab: `${activeTab}`,
            type
          }),
        dispatch
      )(x0),
    [dispatch, alignment, isOpen, lock, type]
  );

  return (
    <Control<Literal>
      value={activeTab ?? tabs[0]?.id}
      onChange={onChange}
      align={alignment}
      onAlign={onAlign}
      locked={!!lock}
      onLock={onLock}
    >
      {tabs.map(({ id, title, label, className, options }) => (
        <Tab
          key={id}
          value={id}
          title={title}
          label={label}
          className={className}
        >
          <Options
            wrapOptions={false}
            data={options}
            toolbar={toolbar}
            isPro={pro}
            upgradeToPro={config?.urls?.upgradeToPro}
          />
        </Tab>
      ))}
    </Control>
  );
};
