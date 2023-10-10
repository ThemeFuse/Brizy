import classnames from "classnames";
import React, { ReactElement } from "react";
import { Manager, Popper, Reference } from "react-popper";
import ClickOutside from "visual/component/ClickOutside";
import Select from "visual/component/Controls/Select";
import SelectItem from "visual/component/Controls/Select/SelectItem";
import SelectOptgroup from "visual/component/Controls/Select/SelectOptgroup";
import EditorIcon from "visual/component/EditorIcon";
import {
  Choices,
  OptGroup
} from "visual/component/Options/types/common/Population/types/Choices";
import { isOptgroup } from "visual/component/Options/types/common/Population/utils";
import { getVaryAttr } from "visual/utils/dynamicContent";
import { Literal } from "visual/utils/types/Literal";
import { Async as SelectAsync } from "../../Options/types/dev/Select/Async";
import { PopulationIcon } from "./PopulationIcon";
import type { Props } from "./types";

const selectConfig = {
  autoClose: true
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
  showChoices,
  choices,
  value,
  entityType,
  className,
  handleClickOutside,
  entityTypeChoices,
  entityId,
  entityIdChoices,
  currentDCChoice,
  handleIconClick,
  onChange,
  onEntityTypeChange,
  onEntityIdChange
}: Props<T>) => {
  const _className = classnames(
    "brz-control__select--dark",
    "brz-control__select__auto",
    "brz-control__select-population",
    { "brz-control__select--active": Boolean(value) },
    className
  );

  const iconClassName = classnames({
    "brz-control__select--active": isOpen
  });

  const wrapperClassName = classnames(
    "brz-ed-control__population--wrapper",
    "brz-control__select-current",
    "brz-control__select-current__icon",
    className
  );

  const predefinedEntityType = currentDCChoice?.attr?.type;
  const { showEntityType, showEntityId } = getVaryAttr(
    currentDCChoice?.varyAttr ?? []
  );

  return (
    <div className={wrapperClassName}>
      <Manager>
        <Reference>
          {({ ref }) => (
            <PopulationIcon
              ref={ref}
              className={iconClassName}
              onClick={handleIconClick}
            />
          )}
        </Reference>
        <div style={{ position: "relative" }}>
          <Popper placement="bottom-start">
            {({ ref, style }) => {
              if (!isOpen) {
                return null;
              }

              const defaultValue = currentDCChoice?.value ?? value;

              return (
                <ClickOutside
                  exceptions={clickOutsideExceptions}
                  onClickOutside={handleClickOutside}
                >
                  <div
                    style={style}
                    ref={ref}
                    className="brz-ed-control__population-content-wrapper"
                  >
                    {showChoices && (
                      <Select
                        className={_className}
                        defaultValue={defaultValue}
                        itemHeight={30}
                        onChange={onChange}
                      >
                        {renderChoices(choices, defaultValue as T)}
                      </Select>
                    )}
                    {defaultValue &&
                      entityTypeChoices &&
                      showEntityType &&
                      !predefinedEntityType && (
                        <SelectAsync
                          value={entityType}
                          choices={entityTypeChoices}
                          config={selectConfig}
                          onChange={onEntityTypeChange}
                        />
                      )}
                    {defaultValue &&
                      showEntityId &&
                      (predefinedEntityType || entityType.value) && (
                        <SelectAsync
                          value={entityId}
                          choices={entityIdChoices}
                          config={selectConfig}
                          onChange={onEntityIdChange}
                        />
                      )}
                  </div>
                </ClickOutside>
              );
            }}
          </Popper>
        </div>
      </Manager>
    </div>
  );
};
