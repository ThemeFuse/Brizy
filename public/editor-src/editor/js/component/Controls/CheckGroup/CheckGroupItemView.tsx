import { noop } from "es-toolkit";
import React, { Attributes, useMemo } from "react";
import { Translate } from "visual/component/Translate";
import { makePlaceholder } from "visual/utils/dynamicContent";
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
  const uidPlaceholder = makePlaceholder({
    content: "{{ random_id }}",
    attr: { key: name }
  });
  const labelId = `${uuid()}_${uidPlaceholder}`;

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
        id={labelId}
        className="brz-input"
        type="checkbox"
        value={value}
        name={name}
        checked={active}
        onChange={noop}
        required={required}
        {...attr}
      />
      <label className="brz-label" htmlFor={labelId}>
        {typeof renderIcons === "function" && renderIcons({ active })}
        {children}
      </label>
    </Translate>
  );
};
