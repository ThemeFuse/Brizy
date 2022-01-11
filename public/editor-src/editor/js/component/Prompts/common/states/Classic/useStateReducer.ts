import { useEffect, useReducer } from "react";
import { loading, St, State } from "./types/State";
import * as Actions from "./types/Actions";
import { from, of, Subscription } from "rxjs";
import { catchError, delay, map, mapTo } from "rxjs/operators";
import { Tabs } from "visual/component/Prompts/common/PromptPage/types";
import { Reducer } from "./types/Reducer";

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
  type _Actions = Actions.Actions<Invalid> | A;

  const [state, dispatch] = useReducer(
    reducer,
    loading({ activeTab: Tabs.page })
  );

  useEffect(() => {
    const fetcher = from(getData())
      .pipe(
        map(t =>
          Actions.fetchSuccess<Invalid>({
            ...t,
            activeTab: Tabs.page
          } as Invalid)
        ),
        catchError(() => of(Actions.fetchError()))
      )
      .subscribe(dispatch);

    return (): void => fetcher?.unsubscribe();
  }, [state.type === "Loading"]);
  useEffect(() => {
    let fetcher: Subscription | undefined;

    if (state.type === "Saving") {
      fetcher = from(onSave(state.payload))
        .pipe(
          mapTo(Actions.saveSuccess()),
          catchError(() => of(Actions.saveError()))
        )
        .subscribe(dispatch);
    }

    return (): void => fetcher?.unsubscribe();
  }, [state.type === "Saving"]);
  useEffect(() => {
    let fetcher: Subscription | undefined;

    if (state.type === "Canceling") {
      fetcher = of(1)
        .pipe(delay(650), mapTo(Actions.canceled()))
        .subscribe(dispatch);
    }

    return (): void => fetcher?.unsubscribe();
  }, [state.type === "Canceling"]);
  useEffect(() => {
    if (state.type === "Canceled") {
      onClose();
    }
  }, [state.type === "Canceled"]);

  return [state, dispatch];
};
