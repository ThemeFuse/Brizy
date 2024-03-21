import React, { ReactElement, useCallback } from "react";
import { Button } from "visual/component/Brizy-ui/Button";
import { TypographyText } from "visual/component/Brizy-ui/Typography";
import { Action } from "../types";

interface Props {
  onClick: (v: string) => void;
  action: Action;
  disabled: boolean;
  isTitleSelected: boolean;
}

export const AiActionButton = ({
  onClick,
  action: { icon, label, action },
  disabled,
  isTitleSelected
}: Props): ReactElement => {
  const handleClick = useCallback(() => onClick(action), [action, onClick]);

  const isShortenOrExtend = label === "Extend" || label === "Shorten";

  const shouldBeDisabled = isShortenOrExtend ? isTitleSelected : disabled;

  const color = shouldBeDisabled ? "gray-dark" : "white";

  return (
    <Button
      disabled={shouldBeDisabled}
      onClick={handleClick}
      color={color}
      hoverColor="blue"
      type="link"
      icon={icon}
    >
      <TypographyText color="inherit" size="small">
        {label}
      </TypographyText>
    </Button>
  );
};
