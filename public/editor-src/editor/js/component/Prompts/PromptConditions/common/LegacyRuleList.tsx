import React from "react";
import { Badge } from "visual/component/Badge";
import { SelectItem } from "visual/component/Controls/InternalLink/Components/SelectItem";
import type { FCC } from "visual/utils/react/types";
import type { LegacyRuleListProps } from "../Rules/types";
import { getOptionItemClassNames } from "../Rules/utils";

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
