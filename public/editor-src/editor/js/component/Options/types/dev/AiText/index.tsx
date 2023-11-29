import React, { useState } from "react";
import { AiText } from "visual/component/Controls/AiText";
import { ToastNotification } from "visual/component/Notifications";
import Config from "visual/global/Config";
import { sendToAi } from "visual/utils/api/common";
import { t } from "visual/utils/i18n";
import { Component } from "./Type";
import { generateTags, purifyTextContent } from "./utils";

export const Ai: Component = (props) => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const config = Config.getAll();

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
    />
  );
};
