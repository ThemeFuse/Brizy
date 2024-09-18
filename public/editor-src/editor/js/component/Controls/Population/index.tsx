import classnames from "classnames";
import React, { ReactElement } from "react";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import SelectOptgroup from "visual/component/Controls/Select/SelectOptgroup";
import EditorIcon from "visual/component/EditorIcon";
import {
  Choices,
  OptGroup
} from "visual/component/Options/types/common/Population/types/Choices";
import { isOptgroup } from "visual/utils/options/Population/utils";
import { Literal } from "visual/utils/types/Literal";
import { Async as SelectAsync } from "../../Options/types/dev/Select/Async";
import { Dropdown } from "./Components/Dropdown";
import type { Props } from "./types";
import { Config } from "visual/component/Options/types/dev/Select/types";

const selectConfig: Config = {
  autoClose: true,
  size: "large"
};

const clickOutsideExceptions = [".brz-control__select-current__icon"];

const renderChoices = <T extends Literal>(
  choices: (Choices<T> | OptGroup<T>)[],
  value: T
): ReactElement[] => {
  return choices.map((choice) => {
    if (isOptgroup(choice)) {
      const { title, icon, optgroup } = choice;

      return (
        <SelectOptgroup
          key={title || icon}
          title={title}
          items={renderChoices(optgroup, value)}
        >
          {icon && <EditorIcon icon={icon} />}
          <span className="brz-span">{title}</span>
        </SelectOptgroup>
      );
    }
    const { value: v, title, icon } = choice;

    return (
      <SelectItem key={v} value={v} title={title} active={v === value}>
        {icon && <EditorIcon icon={icon} />}
        <span className="brz-span">{title}</span>
      </SelectItem>
    );
  });
};

export const Control = <T extends Literal>({
  isOpen,
  isEntityTypeLoaded,
  showChoices,
  choices,
  value,
  entityType,
  className,
  entityTypeChoices,
  entityId,
  entityIdChoices,
  currentDCChoice,
  onChange,
  onEntityTypeChange,
  onEntityIdChange,
  onEntityTypeLoad,
  onOpened
}: Props<T>) => {
  const _className = classnames(
    "brz-control__select--dark",
    "brz-control__select__auto",
    "brz-control__select-population",
    { "brz-control__select--active": Boolean(value) },
    className
  );

  const predefinedEntityType = currentDCChoice?.attr?.type;
  const defaultValue = currentDCChoice?.value ?? value;

  return (
    <Dropdown
      className={className}
      isOpen={isOpen}
      clickOutsideExceptions={clickOutsideExceptions}
      onOpened={onOpened}
    >
      <>
        {!predefinedEntityType && (
          <SelectAsync
            value={entityType}
            choices={entityTypeChoices}
            config={selectConfig}
            onLoad={onEntityTypeLoad}
            onChange={onEntityTypeChange}
          />
        )}
        {showChoices && isEntityTypeLoaded && (
          <Select
            className={_className}
            defaultValue={defaultValue}
            itemHeight={30}
            onChange={onChange}
          >
            {renderChoices(choices, defaultValue as T)}
          </Select>
        )}
        {entityType.value !== "auto" &&
          defaultValue &&
          (predefinedEntityType || entityType.value) && (
            <SelectAsync
              value={entityId}
              choices={entityIdChoices}
              config={selectConfig}
              onChange={onEntityIdChange}
            />
          )}
      </>
    </Dropdown>
  );
};
