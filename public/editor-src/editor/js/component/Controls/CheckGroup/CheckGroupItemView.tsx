import { noop } from "es-toolkit";
import React, { Attributes, useMemo } from "react";
import { Translate } from "visual/component/Translate";
import { makeDataAttr } from "visual/utils/i18n/attribute";
import { uuid } from "visual/utils/uuid";
import { CheckGroupView } from "./types";

export const CheckGroupItemView = ({
  className,
  value,
  active,
  name,
  required,
  renderIcons,
  children,
  type,
  label
}: CheckGroupView): JSX.Element => {
  // Generate a unique id for every checkbox, because otherwise the checkboxes will not work properly
  const id = uuid();

  const attr = useMemo<Attributes>(
    () => ({
      ...makeDataAttr({
        name: "type",
        value: type
      }),
      ...makeDataAttr({
        name: "label",
        value: label
      })
    }),
    [type, label]
  );

  return (
    <Translate className={className}>
      <input
        id={id}
        className="brz-input"
        type="checkbox"
        value={value}
        name={name}
        checked={active}
        onChange={noop}
        required={required}
        {...attr}
      />
      <label className="brz-label" htmlFor={id}>
        {typeof renderIcons === "function" && renderIcons({ active })}
        {children}
      </label>
    </Translate>
  );
};
