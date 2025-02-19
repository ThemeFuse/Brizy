import { IconsName } from "@brizy/ui/es/EditorIcon/types";
import { Spacing } from "@brizy/ui/es/Space/utils";
import React, { ReactElement, useCallback, useRef, useState } from "react";
import { Button } from "visual/component/Brizy-ui/Button";
import { Dropdown } from "visual/component/Brizy-ui/Dropdown";
import { EditorIcon } from "visual/component/Brizy-ui/EditorIcon";
import { Space } from "visual/component/Brizy-ui/Space";
import { TypographyText } from "visual/component/Brizy-ui/Typography";
import { dropdownOffset, iconSpacing } from "../constants";
import { DropdownButtonData } from "../types";
import { DropdownContent } from "./DropdownContent";

const editorIconSpacing: Spacing = [0, 0, 0, 8];
const editorIconStyle = {
  transform: "scale(0.65)"
};

interface Props {
  onOptionClick: (action: string) => void;
  data: DropdownButtonData;
  disabled: boolean;
}

export const AiDropdown = ({
  data: { width, data, icon, label },
  onOptionClick,
  disabled
}: Props): ReactElement => {
  const [opened, setOpen] = useState<boolean>(false);

  const nodeRef = useRef<HTMLDivElement>(null);

  const handleOpen = useCallback(() => setOpen((v) => !v), []);

  const getContainer = useCallback(() => nodeRef.current ?? document.body, []);

  const color = disabled ? "gray-dark" : "white";

  return (
    <div ref={nodeRef}>
      <Dropdown
        getContainer={getContainer}
        onOpenedChange={handleOpen}
        placement="topLeft"
        content={
          <DropdownContent
            width={width}
            onOptionClick={onOptionClick}
            options={data}
          />
        }
        offset={dropdownOffset}
      >
        <Button
          disabled={disabled}
          color={color}
          hoverColor="blue"
          type="link"
          icon={<Space spacing={iconSpacing}>{icon}</Space>}
        >
          <TypographyText color="inherit" size="small">
            {label}
          </TypographyText>
          <Space spacing={editorIconSpacing}>
            <EditorIcon
              style={editorIconStyle}
              icon={opened ? IconsName.StreUp : IconsName.StreDown}
            />
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
};
