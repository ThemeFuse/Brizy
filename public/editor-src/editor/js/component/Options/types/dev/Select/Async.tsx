import { isEqual } from "es-toolkit";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import { t } from "visual/utils/i18n";
import { MValue } from "visual/utils/value";
import { Sync } from "./Sync";
import { ChoicesAsync, ChoicesSync, Props } from "./types";

export const Async = (
  props: Omit<Props, "choices"> & {
    choices: ChoicesAsync;
  }
): ReactElement => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [choices, setChoices] = useState<ChoicesSync>([]);
  const [hasError, setHasError] = useState(false);

  const prevChoices = useRef<MValue<ChoicesSync>>(undefined);

  useEffect(() => {
    const controller = new AbortController();

    props.choices
      .load(controller.signal)
      .then((r) => {
        if (!controller.signal.aborted) {
          setIsLoaded(true);
          setChoices(r);

          if (!isEqual(prevChoices.current, r)) {
            prevChoices.current = r;

            props?.onLoad?.();
          }
        }
      })
      .catch((r) => {
        setHasError(true);
        setIsLoaded(true);
        ToastNotification.error(r ?? t("Something went wrong"));
      });

    return (): void => {
      controller?.abort();
    };
    // all "props" object is not needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.choices]);

  if (!isLoaded) {
    return (
      <div className="brz-ed-option-type__select__spinner-container">
        <EditorIcon
          icon="nc-circle-02"
          className="brz-ed-option-type__select__spinner brz-ed-animated--spin"
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
