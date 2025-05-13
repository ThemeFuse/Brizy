import { EnterRounded } from "@brizy/ui-icons/lib/icons/EnterRounded";
import { Spacing } from "@brizy/ui/es/Space/utils";
import { FieldsTheme } from "@brizy/ui/es/utils/getFieldsTheme";
import { Gutter } from "@brizy/ui/lib/Layout/utils";
import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Button } from "visual/component/Brizy-ui/Button";
import { Card } from "visual/component/Brizy-ui/Card";
import { Icon } from "visual/component/Brizy-ui/Icon";
import { Inline } from "visual/component/Brizy-ui/Inline";
import { Input } from "visual/component/Brizy-ui/Input";
import { Layout, LayoutSection } from "visual/component/Brizy-ui/Layout";
import { Space } from "visual/component/Brizy-ui/Space";
import { t } from "visual/utils/i18n";
import { cardSize } from "./constants";
import { AiActionButton } from "./controls/AiActionButton";
import { getActions } from "./data/aiTextActions";

// import { AiDropdown } from "./controls/AiDropdown";
// import { data } from "./data/aiText";
// import { DropdownButtonData } from "./types";

const theme: FieldsTheme = {
  background: "dark",
  borderColor: "dark",
  color: "white"
};

const controlsSpacing: Spacing = [0, 0, 15, 10];
const textareaSpacing: Spacing = [0, 8, 5, 0];
const textareaButtonSpacing: Spacing = [0, 0, 0, 5];
const promptAreaGutter: Gutter = [0, 0];

interface Props {
  onChange: (v: string) => void;
  value: string;
  loading: boolean;
  submitRequest: (prompt: string, action?: string) => void;
  prompt: string;
  isTitleSelected: boolean;
}

export const AiText = ({
  onChange,
  value,
  loading,
  submitRequest,
  prompt,
  isTitleSelected
}: Props): ReactElement => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);

  const iconColor = value.length > 0 ? "white" : "gray";

  const handleClick = useCallback(
    (action: string) => {
      submitRequest(prompt, action);
    },
    [prompt, submitRequest]
  );

  const handlePressEnter = useCallback(() => {
    if (!loading && value.length > 0) {
      submitRequest(value);
    }
  }, [loading, value, submitRequest]);

  useEffect(() => {
    if (prompt.length <= 3) {
      setDisabled(true);
    }
  }, [prompt]);

  useEffect(() => {
    setButtonDisabled(value.length === 0 || loading);
  }, [value, loading]);

  const actions = getActions();

  return (
    <Card width="407px" size={cardSize} borderStyle="none" color="transparent">
      <Space spacing={controlsSpacing}>
        <Card size={cardSize} width="407px" height="16px">
          <Inline spacing={20}>
            {actions.map((action, index) => (
              <AiActionButton
                isTitleSelected={isTitleSelected}
                disabled={disabled}
                key={index}
                onClick={handleClick}
                action={action}
              />
            ))}
            {/* temporary commented https://github.com/bagrinsergiu/blox-editor/issues/26546*/}
            {/* {data.map((item: DropdownButtonData, index: number) => (
              <AiDropdown
                disabled={disabled}
                onOptionClick={handleClick}
                data={item}
                key={index}
              />
            ))} */}
          </Inline>
        </Card>
      </Space>
      <Space spacing={textareaSpacing}>
        <Layout alignY="middle" gutter={promptAreaGutter}>
          <LayoutSection span={23}>
            <Input.TextArea
              theme={theme}
              placeholder={t("Tell AI what to write in any language ...")}
              onChange={onChange}
              value={value}
              size="xsmall"
              onPressEnter={handlePressEnter}
            />
          </LayoutSection>
          <LayoutSection span={1}>
            <Space spacing={textareaButtonSpacing}>
              <Button
                color="white"
                hoverColor="white"
                type="dashed"
                loading={loading}
                disabled={buttonDisabled}
                icon={
                  <Icon size="20px" source={EnterRounded} color={iconColor} />
                }
                onClick={handlePressEnter}
              ></Button>
            </Space>
          </LayoutSection>
        </Layout>
      </Space>
    </Card>
  );
};
