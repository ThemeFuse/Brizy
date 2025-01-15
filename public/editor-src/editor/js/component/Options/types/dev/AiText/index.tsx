import React, { useState } from "react";
import { AiText } from "visual/component/Controls/AiText";
import { ToastNotification } from "visual/component/Notifications";
import { useConfig } from "visual/global/hooks";
import { sendToAi } from "visual/utils/api/common";
import { t } from "visual/utils/i18n";
import {
  generateTags,
  purifyTextContent
} from "visual/utils/options/AiText/utils";
import { Component } from "./Type";

export const Ai: Component = (props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  const config = useConfig();

  let pureValue = purifyTextContent(props.value.value);
  let pureSelectedValue = "";

  if (props.selectedValue) {
    pureSelectedValue = purifyTextContent(props.selectedValue);
  }

  pureValue = pureValue.replaceAll("\n", "").trim();
  pureSelectedValue = pureSelectedValue.replaceAll("\n", "").trim();

  const prompt = pureSelectedValue.length > 0 ? pureSelectedValue : pureValue;

  const { openingTags, closingTags } = generateTags(props.value.value);

  const handleSubmitRequest = async (prompt: string, action?: string) => {
    setLoading(true);

    try {
      const content = await sendToAi(config, {
        prompt,
        action
      });

      // If selected all TEXT (or nothing selected manually === selected all text)
      if (pureSelectedValue === "" || pureSelectedValue === pureValue) {
        const formattedContent = content.replaceAll(
          "\n\n",
          `${closingTags}${openingTags}`
        );

        props.onChange({
          value: `${openingTags}${formattedContent}${closingTags}`
        });
      } else {
        // If selected piece of TEXT
        if (props.value.value.includes(pureSelectedValue)) {
          const newValue = props.value.value.replace(
            pureSelectedValue,
            content.replaceAll("\n\n", `${closingTags}${openingTags}`)
          );

          props.onChange({
            value: `${newValue}`
          });
        } else {
          props.onChange({
            value: `${openingTags}${pureValue.replace(
              pureSelectedValue,
              content
            )}${closingTags}`
          });
        }
      }
    } catch (e) {
      typeof e === "string"
        ? ToastNotification.error(e)
        : ToastNotification.error(t("Something went wrong, please try again"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AiText
      prompt={prompt}
      value={value}
      onChange={setValue}
      submitRequest={handleSubmitRequest}
      loading={loading}
      isTitleSelected={prompt.split(" ").length < 13}
    />
  );
};
