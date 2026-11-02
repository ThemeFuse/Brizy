import React, { Fragment, type ReactElement } from "react";
import { Card } from "visual/component/Brizy-ui/Card";
import { Divider } from "visual/component/Brizy-ui/Divider";
import { cardSize } from "../constants";
import type { DropdownOption } from "../types";
import { AiDropdownItem } from "./AiDropdownItem";

interface Props {
  options: DropdownOption[];
  width: string;
  onOptionClick: (action: string) => void;
}

export const DropdownContent = ({
  width,
  options,
  onOptionClick
}: Props): ReactElement => (
  <Card
    size={cardSize}
    height="fit-content"
    width={width}
    borderStyle="none"
    color="gray-darkest"
    borderRadius="4px"
  >
    {options.map((option, index) => (
      <Fragment key={option.action}>
        <AiDropdownItem option={option} onClick={onOptionClick} />
        {index < options.length - 1 && <Divider color="gray" />}
      </Fragment>
    ))}
  </Card>
);
