import React, { ReactElement, ReactNode, useEffect, useReducer } from "react";
import { forkJoin, of } from "rxjs";
import { catchError, mapTo, switchMap } from "rxjs/operators";
import { noop } from "underscore";
import { Button } from "visual/component/Controls/Button";
import EditorIcon from "visual/component/EditorIcon";
import { Tabs } from "visual/component/Prompts/Tabs";
import { Button as PromptButton } from "visual/component/Prompts/common/Button";
import { pendingRequest } from "visual/utils/api";
import { t } from "visual/utils/i18n";

enum State {
  closed = "closed",
  ready = "ready",
  canceling = "canceling",
  saving = "saving"
}
enum Actions {
  close = "close",
  open = "open",
  cancel = "cancel",
  save = "save",
  saveSuccess = "saveSuccess",
  saveErr = "saveErr",
  cancelSuccess = "cancelSuccess",
  cancelErr = "cancelErr"
}

export interface Props {
  label: ReactNode;
  img: string;
  description: string;
  children?: ReactNode;
  onSave: () => Promise<void>;
  onCancel: () => Promise<void>;
}

const tab = [{ id: "", icon: "nc-extensions-2", title: t("Connect") }];

export const PromptFrame = ({
  img,
  label,
  children,
  onSave,
  onCancel,
  description
}: Props): ReactElement => {
  const [state, dispatch] = useReducer((s: State, a: Actions): State => {
    switch (a) {
      case Actions.close:
        return s !== State.closed ? State.closed : s;
      case Actions.open:
        return s === State.closed ? State.ready : s;
      case Actions.cancel:
        return s === State.ready ? State.canceling : s;
      case Actions.cancelSuccess:
        return s === State.canceling ? State.closed : s;
      case Actions.cancelErr:
        return s === State.canceling ? State.closed : s;
      case Actions.save:
        return s === State.ready ? State.saving : s;
      case Actions.saveSuccess:
        return s === State.saving ? State.closed : s;
      case Actions.saveErr:
        return s === State.saving ? State.ready : s;
    }
  }, State.closed);

  useEffect(() => {
    if (state === State.saving) {
      const s = of(1)
        .pipe(
          switchMap(() => forkJoin([onSave(), pendingRequest()])),
          mapTo(Actions.saveSuccess),
          catchError(() => of(Actions.saveErr))
        )
        .subscribe(dispatch);

      return () => s.unsubscribe();
    }
  }, [state === State.saving]);
  useEffect(() => {
    if (state === State.canceling) {
      const s = of(1)
        .pipe(
          switchMap(() => forkJoin([onCancel(), pendingRequest()])),
          mapTo(Actions.cancelSuccess),
          catchError(() => of(Actions.cancelErr))
        )
        .subscribe(dispatch);

      return () => s.unsubscribe();
    }
  }, [state === State.canceling]);

  return (
    <>
      {label}
      <Button
        onClick={() => dispatch(Actions.open)}
        align={"right"}
        className={"brz-ed-control__prompt-form__button"}
      >
        <EditorIcon icon={"nc-extensions-2"} />
      </Button>
      {state === State.closed ? null : (
        <Tabs
          tabs={tab}
          onChange={noop}
          value={""}
          onClose={() => dispatch(Actions.close)}
        >
          <div className="brz-ed-popup-integrations__connect">
            <div className="brz-ed-popup-integrations__connect-head">
              <img className="brz-img" src={img} alt={img} />
              <p className="brz-p brz-ed-popup-integrations__connect-info">
                {description}
              </p>
            </div>
            <div className="brz-ed-popup-integrations__connect-body">
              {children}
              <PromptButton
                color="teal"
                loading={state === State.saving}
                onClick={() => dispatch(Actions.save)}
              >
                {t("Connect")}
              </PromptButton>
              <PromptButton
                color="default"
                loading={state === State.canceling}
                onClick={() => dispatch(Actions.cancel)}
              >
                {t("Cancel")}
              </PromptButton>
            </div>
          </div>
        </Tabs>
      )}
    </>
  );
};
