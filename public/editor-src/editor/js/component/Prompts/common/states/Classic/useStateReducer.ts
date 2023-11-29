import { useEffect, useMemo, useReducer } from "react";
import { Subscription, from, of } from "rxjs";
import { catchError, delay, map, mapTo } from "rxjs/operators";
import { Tabs } from "visual/component/Prompts/common/PromptPage/types";
import * as Actions from "./types/Actions";
import { Reducer } from "./types/Reducer";
import { St, State, loading } from "./types/State";

export const useStateReducer = <
  Invalid extends St,
  Valid extends Invalid,
  A extends { type: string }
>(
  reducer: Reducer<Invalid, Valid, A>,
  getData: () => Promise<Omit<Invalid, "activeTab">>,
  onSave: (v: Valid) => Promise<void>,
  onClose: () => void
): [State<Invalid, Valid>, (a: Actions.PublicActions | A) => void] => {
  const [state, dispatch] = useReducer(
    reducer,
    loading({ activeTab: Tabs.settings })
  );

  const { type, payload } = state;

  const isLoading = useMemo(() => type === "Loading", [type]);
  const isSaving = useMemo(() => type === "Saving", [type]);
  const isCanceling = useMemo(() => type === "Canceling", [type]);
  const isCanceled = useMemo(() => type === "Canceled", [type]);

  useEffect(() => {
    const fetcher = from(getData())
      .pipe(
        map((t) =>
          Actions.fetchSuccess<Invalid>({
            ...t,
            activeTab: Tabs.settings
          } as Invalid)
        ),
        catchError(() => of(Actions.fetchError()))
      )
      .subscribe(dispatch);

    return (): void => fetcher?.unsubscribe();
  }, [isLoading, getData]);

  useEffect(() => {
    let fetcher: Subscription | undefined;

    if (isSaving) {
      fetcher = from(onSave(payload as Valid))
        .pipe(
          mapTo(Actions.saveSuccess()),
          catchError(() => of(Actions.saveError()))
        )
        .subscribe(dispatch);
    }

    return (): void => fetcher?.unsubscribe();
  }, [onSave, payload, isSaving]);

  useEffect(() => {
    let fetcher: Subscription | undefined;

    if (isCanceling) {
      fetcher = of(1)
        .pipe(delay(650), mapTo(Actions.canceled()))
        .subscribe(dispatch);
    }

    return (): void => fetcher?.unsubscribe();
  }, [isCanceling]);
  useEffect(() => {
    if (isCanceled) {
      onClose();
    }
  }, [onClose, isCanceled]);

  return [state, dispatch];
};
