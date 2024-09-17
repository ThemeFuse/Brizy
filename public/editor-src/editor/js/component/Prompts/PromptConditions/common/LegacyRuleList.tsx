import React from "react";
import { LegacyRuleListProps } from "../Rules/types";
import { SelectItem } from "visual/component/Controls/InternalLink/Components/SelectItem";
import { Badge } from "visual/component/Badge";
import { getOptionItemClassNames } from "../Rules/utils";
import { FCC } from "visual/utils/react/types";

export const LegacyRuleList: FCC<LegacyRuleListProps> = ({
  item: { title, value, status },
  onClick,
  value: valueSelected
}) => (
  <div
    key={value}
    onClick={() => onClick(`specific|||${value}`)}
    className={getOptionItemClassNames(title === valueSelected)}
  >
    <SelectItem title={title} />
    {status && <Badge status={status} />}
  </div>
);
