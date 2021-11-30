import React, { FC, useEffect, useState } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { ChoicesAsync, ChoicesSync, Props } from "./types";
import { Sync } from "./Sync";
import { t } from "visual/utils/i18n";

export const Async: FC<Omit<Props, "choices"> & {
  choices: ChoicesAsync;
}> = props => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [choices, setChoices] = useState<ChoicesSync>([]);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    props.choices
      .load(controller.signal)
      .then(r => {
        if (!controller.signal.aborted) {
          setIsLoaded(true);
          setChoices(r);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setHasError(true);
        }
      });

    return (): void => {
      controller?.abort();
    };
  }, [props.choices]);

  if (!isLoaded) {
    return (
      <div className="brz-ed-option-type__select-dev__spinner-container">
        <EditorIcon
          icon="nc-circle-02"
          className="brz-ed-option-type__select-dev__spinner brz-ed-animated--spin"
        />
      </div>
    );
  }

  if (hasError) {
    return <p style={{ color: "white" }}>Error</p>;
  }

  if (choices.length) {
    return <Sync {...props} choices={choices} />;
  }

  const emptyChoices: ChoicesSync = [
    {
      title: props.choices.emptyLoad?.title ?? t("Don't have items"),
      value: ""
    }
  ];
  return <Sync {...props} choices={emptyChoices} />;
};
