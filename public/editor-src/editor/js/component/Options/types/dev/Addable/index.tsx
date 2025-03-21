import { DragEndEvent } from "@dnd-kit/core";
import classNames from "classnames";
import React, { useCallback, useEffect, useReducer, useRef } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { useTranslation } from "visual/providers/I18nProvider";
import { uuid } from "visual/utils/uuid";
import { NoAddableItems } from "./components/NoItems";
import { Sidebar } from "./components/Sidebar";
import { Sortable } from "./components/Sortable";
import { ActiveGroup, AddableActions, Component } from "./types";
import { getGroupsOrder, itemsReducer } from "./utils";

export const Addable: Component = (props) => {
  const { id: addableId, onChange, toolbar, optionGroups, config } = props;
  const { t } = useTranslation();
  const addableRef = useRef<HTMLDivElement | null>(null);
  const [state, dispatch] = useReducer(itemsReducer, {
    optionGroups,
    activeGroup: null,
    sidebar: {
      isOpen: false,
      alignment: "right"
    }
  });
  const icon = config?.icon ?? "nc-iframe";
  const _title = config?.title ?? addableId;
  const title = config?.showCount
    ? `${_title}: ${state.optionGroups.length} Items`
    : _title;
  const optionGroupTitle = config?.optionGroupTitle ?? t("Widget");
  const container = window?.parent?.document.body;

  useEffect(() => {
    state.optionGroups !== optionGroups &&
      onChange({ value: getGroupsOrder(state.optionGroups) });
    // Only when groups from state was changed,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, state.optionGroups]);

  useEffect(() => {
    dispatch({
      type: AddableActions.SET_OPTION_GROUPS,
      payload: { optionGroups }
    });
  }, [optionGroups]);

  const handleAddGroup = useCallback(() => {
    onChange({
      value: [
        ...getGroupsOrder(state.optionGroups),
        {
          id: uuid(6),
          title: `${optionGroupTitle} ${state.optionGroups.length}`
        }
      ]
    });
  }, [onChange, state.optionGroups, optionGroupTitle]);

  const handleRemoveGroup = useCallback((groupId: string) => {
    dispatch({
      type: AddableActions.REMOVE,
      payload: { groupId }
    });
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && over.id !== active.id) {
        const oldIndex = state.optionGroups.findIndex(
          ({ id }) => id === active.id
        );
        const newIndex = state.optionGroups.findIndex(
          ({ id }) => id === over.id
        );

        dispatch({
          type: AddableActions.REORDER,
          payload: { oldIndex, newIndex }
        });
      }
    },
    [state.optionGroups]
  );

  const handleToggleSidebar = useCallback(() => {
    dispatch({
      type: AddableActions.TOGGLE_SIDEBAR
    });
  }, []);

  const handleSidebarAlign = useCallback(() => {
    dispatch({
      type: AddableActions.TOGGLE_SIDEBAR_ALIGNMENT
    });
  }, []);

  const setActiveGroup = useCallback((payload: ActiveGroup) => {
    dispatch({
      type: AddableActions.SET_ACTIVE_GROUP,
      payload
    });
  }, []);

  const setGroupTitle = useCallback(
    (payload: { groupId: string; title: string }) => {
      dispatch({
        type: AddableActions.SET_GROUP_TITLE,
        payload
      });
    },
    []
  );

  const handleClickOutsideSidebar = useCallback(() => {
    dispatch({ type: AddableActions.CLOSE_SIDEBAR });
  }, []);

  const sidebarContent =
    state.optionGroups.length === 0 ? (
      <NoAddableItems emptyMessage={config?.emptyMessage} />
    ) : (
      <Sortable
        activeGroup={state.activeGroup}
        optionGroups={state.optionGroups}
        onRemove={handleRemoveGroup}
        onDragEnd={handleDragEnd}
        onRename={setGroupTitle}
        setActiveGroup={setActiveGroup}
        toolbar={toolbar}
        overlayRenderNode={container}
      />
    );

  const openButtonClassname = classNames("brz-ed-addable__icon", {
    "brz-ed-addable__icon--open": state.sidebar.isOpen
  });

  return (
    <>
      <div className="brz-ed-option__label" ref={addableRef}>
        {title}
      </div>
      <div
        onClick={handleToggleSidebar}
        className="brz-ed-addable__icon-wrapper"
      >
        {config?.extraLabel && <span>{config.extraLabel}</span>}
        <EditorIcon icon={icon} className={openButtonClassname} />
      </div>

      {/*For SSR when container is undefined*/}
      {container && (
        <Sidebar
          renderNode={container}
          isOpen={state.sidebar.isOpen}
          onClickOutside={handleClickOutsideSidebar}
          align={state.sidebar.alignment}
          onAlign={handleSidebarAlign}
          onAddGroup={handleAddGroup}
          sidebarHeadTitle={config?.sidebarHeadTitle}
          addNewGroupTitle={config?.addNewGroupTitle}
          className={config?.className}
        >
          {sidebarContent}
        </Sidebar>
      )}
    </>
  );
};
