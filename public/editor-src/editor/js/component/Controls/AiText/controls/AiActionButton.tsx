import { Action } from "../types";
import React, { FC, ReactElement, useCallback } from "react";
import { Button } from "visual/component/Brizy-ui/Button";
import { TypographyText } from "visual/component/Brizy-ui/Typography";

interface Props {
  onClick: (v: string) => void;
  action: Action;
  disabled: boolean;
}

export const AiActionButton: FC<Props> = ({
  onClick,
  action: { icon, label, action },
  disabled,
}): ReactElement => {
  const handleClick = useCallback(() => onClick(action), [action, onClick]);

  const color = disabled ? "gray-dark" : "white";

  return (
    <Button disabled={disabled} onClick={handleClick} color={color} hoverColor="blue" type="link" icon={icon}>
      <TypographyText color="inherit" size="small">
        {label}
      </TypographyText>
    </Button>
  );
};
