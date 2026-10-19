import React from "react";
import { Badge } from "visual/component/Badge";
import { SelectItem } from "visual/component/Controls/InternalLink/Components/SelectItem";
import SelectOptgroup from "visual/component/Controls/Select/SelectOptgroup";
import type { FCC } from "visual/utils/react/types";
import type { RuleListProps } from "../Rules/types";
import { getOptionItemClassNames } from "../Rules/utils";

export const ListItems: FCC<RuleListProps> = ({
  item: { title, items, mode },
  onClick,
  value: valueSelected
}) => (
  <>
    <SelectOptgroup title={title}>
      <span className="brz-span">{title}</span>
    </SelectOptgroup>
    {items.map(({ title, status, value }) => (
      <div
        key={value}
        onClick={() => onClick(`${mode}|||${value}`)}
        className={getOptionItemClassNames(title === valueSelected)}
      >
        <SelectItem title={title} />
        {status && (
          <Badge status={status === "published" ? "publish" : status} />
        )}
      </div>
    ))}
  </>
);
