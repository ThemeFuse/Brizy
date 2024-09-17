import React from "react";
import SelectOptgroup from "visual/component/Controls/Select/SelectOptgroup";
import { SelectItem } from "visual/component/Controls/InternalLink/Components/SelectItem";
import { Badge } from "visual/component/Badge";
import { FCC } from "visual/utils/react/types";
import { getOptionItemClassNames } from "../Rules/utils";
import { RuleListProps } from "../Rules/types";

export const ListItems: FCC<RuleListProps> = ({
  item: { title, items, mode },
  onClick,
  value: valueSelected
}) => (
  <>
    <SelectOptgroup title={title}>
      <span className="brz-span">{title}</span>
    </SelectOptgroup>
    {items.map(({ title, status, value }, _index) => (
      <div
        key={_index}
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
