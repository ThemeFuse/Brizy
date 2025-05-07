import classNames from "classnames";
import React, { forwardRef, useCallback } from "react";
import EditorIcon from "visual/component/EditorIcon";
import Option from "visual/component/Options/Option";
import { useDebouncedOnChange } from "visual/component/hooks";
import { usePro } from "visual/global/hooks";
import { useConfig } from "visual/providers/ConfigProvider";
import {
  GroupBodyProps,
  GroupHeadProps,
  GroupProps,
  GroupTitleProps
} from "../types";

export const Group = forwardRef<HTMLDivElement, GroupProps>((props, ref) => {
  const { style, options, isOpen, isActive, ...headProps } = props;

  const groupClassnames = classNames("brz-ed-addable__group", {
    "brz-ed-addable__group--expanded": isOpen,
    "brz-ed-addable__group--active": isActive
  });

  return (
    <div ref={ref} style={style} className={groupClassnames}>
      <GroupHead isOpen={isOpen} {...headProps} />
      {isOpen && <GroupBody options={options} />}
    </div>
  );
});

function GroupHead(props: GroupHeadProps) {
  const { title, isOpen, dragDisabled, listeners, onOpen, onRemove, onRename } =
    props;

  const isOpenButtonClassname = classNames(
    "brz-ed-addable__group__head__expand-btn",
    {
      "rotate-180": isOpen
    }
  );
  const dragPointerClassName = classNames(
    "brz-ed-addable__group__head__drag-pointer",
    { "brz-ed-addable__group__head__drag-pointer--disabled": dragDisabled }
  );

  return (
    <div className="brz-ed-addable__group__head">
      <span className={dragPointerClassName} {...(!dragDisabled && listeners)}>
        <EditorIcon icon="t2-reorder" />
      </span>
      <GroupTitle title={title} onRename={onRename} />
      {onRemove && (
        <EditorIcon
          onClick={onRemove}
          icon="nc-trash"
          className="brz-ed-addable__group__head__remove"
        />
      )}
      <EditorIcon
        onClick={onOpen}
        icon="nc-down-arrow-thin"
        className={isOpenButtonClassname}
      />
    </div>
  );
}

function GroupTitle(props: GroupTitleProps) {
  const { title: _title, onRename } = props;

  const handleChange = useCallback(
    (newTitle: string) => {
      onRename?.(newTitle);
    },
    [onRename]
  );

  const [title, handleUpdateTitle] = useDebouncedOnChange(
    _title,
    handleChange,
    250
  );

  return (
    <div className="brz-ed-addable__group__head__title">
      <input
        type="text"
        value={title}
        onChange={(e) => handleUpdateTitle(e.target.value)}
      />
    </div>
  );
}

function GroupBody(props: GroupBodyProps) {
  const { options, toolbar } = props;
  const config = useConfig();
  const pro = usePro();

  return (
    <div className="brz-ed-addable__group__body">
      {options.map((option, index) => (
        <Option
          key={index}
          data={option}
          toolbar={toolbar}
          isPro={pro}
          upgradeToPro={config?.urls?.upgradeToPro ?? ""}
        />
      ))}
    </div>
  );
}
