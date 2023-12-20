import { Spacing } from "@brizy/ui/es/Space/utils";
import React, { FC, ReactElement, useCallback } from "react";
import { Button } from "visual/component/Brizy-ui/Button";
import { Space } from "visual/component/Brizy-ui/Space";
import { TypographyText } from "visual/component/Brizy-ui/Typography";
import { DropdownOption } from "../types";

const spaceSpacing: Spacing = [5, 10];

interface Props {
  onClick: (action: string) => void;
  option: DropdownOption;
}

export const AiDropdownItem: FC<Props> = ({
  option: { action, label },
  onClick
}): ReactElement => {
  const handleClick = useCallback(() => onClick(action), [action, onClick]);

  return (
    <Space spacing={spaceSpacing}>
      <Button onClick={handleClick} hoverColor="blue" type="link">
        <TypographyText size="small" color="white">
          {label}
        </TypographyText>
      </Button>
    </Space>
  );
};
