import { HelpSidebarContent } from "@brizy/builder-ui-components";
import { noop } from "es-toolkit";
import React, { ReactElement, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RightSidebarTabs as Control } from "visual/component/Controls/RightSidebarTabs";
import { Tab } from "visual/component/Controls/Tabs2/Tab";
import { useIsRTL } from "visual/global/hooks";
import { useConfig } from "visual/providers/ConfigProvider";
import { updateUI } from "visual/redux/actions2";
import { uiSelector } from "visual/redux/selectors";
import { always, pipe } from "visual/utils/fp";
import { t } from "visual/utils/i18n";
import { prop } from "visual/utils/object/get";
import { nextAlign } from "../Options/types/dev/SidebarTabs/utils";

export const HelpSidebar = (): ReactElement => {
  const dispatch = useDispatch();
  const isRtl = useIsRTL();

  const selector = pipe(uiSelector, prop("rightSidebar"));
  const { alignment, lock, isOpen, activeTab, type, expanded } = useSelector(selector);

  const { ui, urls } = useConfig();
  const dataLinks = useMemo(() => ui?.help?.video ?? [], [ui?.help?.video]);
  const urlSupport = useMemo(() => urls?.support ?? "", [urls?.support]);
  const helpImage = useMemo(
    () =>
      ui?.help?.header ?? {
        url: "",
        src: ""
      },
    [ui?.help?.header]
  );

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
            type,
            expanded
          }),
        dispatch
      )(),
    [dispatch, alignment, isOpen, lock, activeTab, type, expanded]
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
            type,
            expanded
          }),
        dispatch
      )(),
    [dispatch, alignment, isOpen, lock, activeTab, type, expanded]
  );

  const onExpand = useCallback(
    () =>
      pipe(
        () => !expanded,
        (expanded) =>
          updateUI("rightSidebar", {
            alignment,
            isOpen,
            lock,
            activeTab,
            type,
            expanded
          }),
        dispatch
      )(),
    [dispatch, alignment, isOpen, lock, activeTab, type, expanded]
  );

  return (
    <Control<string>
      value={"1"}
      onChange={noop}
      align={alignment}
      onAlign={onAlign}
      locked={!!lock}
      onLock={onLock}
      expand={!!expanded}
      onExpand={onExpand}
    >
      {[
        <Tab key={1} value="1" title={t("Help")} label={t("Help")}>
          <HelpSidebarContent
            data={dataLinks}
            urlSupport={urlSupport}
            urlTitle={t("Send a support ticket")}
            inputPlaceholder={t("How can we help?")}
            helpImage={helpImage}
            isRtl={isRtl}
          />
        </Tab>
      ]}
    </Control>
  );
};
