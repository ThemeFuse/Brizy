import { noop } from "es-toolkit";
import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useReducer
} from "react";
import { Subscription, forkJoin, of } from "rxjs";
import { catchError, mapTo, switchMap } from "rxjs/operators";
import { Button } from "visual/component/Controls/Button";
import EditorIcon from "visual/component/EditorIcon";
import { Tabs } from "visual/component/Prompts/Tabs";
import { pendingRequest } from "visual/utils/api";
import { t } from "visual/utils/i18n";
import { MValue } from "visual/utils/value";
import { PromptView } from "./PromptView";

enum State {
  closed = "closed",
  ready = "ready",
  canceling = "canceling",
  saving = "saving",
  apiKeyError = "apiKeyError"
}
enum Actions {
  close = "close",
  open = "open",
  cancel = "cancel",
  save = "save",
  saveSuccess = "saveSuccess",
  saveErr = "saveErr",
  cancelSuccess = "cancelSuccess",
  cancelErr = "cancelErr",
  apiKeyError = "apiKeyError"
}

export type Validator = (v: unknown) => boolean;

export interface Props {
  label: ReactNode;
  img: string;
  description: string;
  children?: ReactNode;
  onSave: () => Promise<void>;
  onCancel: () => Promise<void>;
  value: MValue<string>;
  validator: Validator;
}

const getTabs = () => [
  { id: "", icon: "nc-extensions-2", title: t("Connect") }
];

export const PromptFrame = ({
  img,
  label,
  children,
  onSave,
  onCancel,
  description,
  value,
  validator
}: Props): ReactElement => {
  const [state, dispatch] = useReducer((s: State, a: Actions): State => {
    const isReadyOrApiError = s === State.ready || s === State.apiKeyError;

    switch (a) {
      case Actions.close:
        return s !== State.closed ? State.closed : s;
      case Actions.open:
        return s === State.closed ? State.ready : s;
      case Actions.cancel:
        return isReadyOrApiError ? State.canceling : s;
      case Actions.cancelSuccess:
        return s === State.canceling ? State.closed : s;
      case Actions.cancelErr:
        return s === State.canceling ? State.closed : s;
      case Actions.save:
        return isReadyOrApiError ? State.saving : s;
      case Actions.saveSuccess:
        return s === State.saving ? State.closed : s;
      case Actions.saveErr:
        return s === State.saving ? State.ready : s;
      case Actions.apiKeyError:
        return s === State.saving ? State.apiKeyError : s;
    }
  }, State.closed);

  const isSaving = useMemo(() => state === State.saving, [state]);
  const isCanceling = useMemo(() => state === State.canceling, [state]);
  const isClosed = useMemo(() => state === State.closed, [state]);
  const hasApiKeyError = useMemo(() => state === State.apiKeyError, [state]);

  const onSave$ = useMemo(
    () =>
      of(1).pipe(
        switchMap(() => forkJoin([onSave(), pendingRequest()])),
        mapTo(Actions.saveSuccess),
        catchError(() => of(Actions.saveErr))
      ),
    [onSave]
  );

  useEffect(() => {
    let subscription: MValue<Subscription>;

    if (isSaving) {
      const isValidAPIKey = validator(value);

      if (isValidAPIKey) {
        subscription = onSave$.subscribe(dispatch);
      } else {
        dispatch(Actions.apiKeyError);
      }
    }

    return () => subscription?.unsubscribe();
  }, [onSave, isSaving, validator, value, onSave$]);

  useEffect(() => {
    if (isCanceling) {
      const s = of(1)
        .pipe(
          switchMap(() => forkJoin([onCancel(), pendingRequest()])),
          mapTo(Actions.cancelSuccess),
          catchError(() => of(Actions.cancelErr))
        )
        .subscribe(dispatch);

      return () => s.unsubscribe();
    }
  }, [onCancel, isCanceling]);

  const tabs = getTabs();

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
      {isClosed ? null : (
        <Tabs
          tabs={tabs}
          onChange={noop}
          value={""}
          onClose={() => dispatch(Actions.close)}
        >
          <PromptView
            img={img}
            title={img}
            description={description}
            error={hasApiKeyError ? t("Enter API key") : undefined}
            isSaving={isSaving}
            isCanceling={isCanceling}
            onClickSave={() => dispatch(Actions.save)}
            onClickCancel={() => dispatch(Actions.cancel)}
          >
            {children}
          </PromptView>
        </Tabs>
      )}
    </>
  );
};
