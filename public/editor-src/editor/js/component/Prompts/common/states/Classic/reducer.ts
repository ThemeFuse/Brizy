import { t } from "visual/utils/i18n";
import { Actions, ActionTypes } from "./types/Actions";
import * as State from "./types/State";
import { match } from "fp-utilities";
import { Either } from "visual/component/Prompts/common/states/Classic/types/Either";

const isActions = <Invalid extends State.St, A extends { type: string }>(
  a: Actions<Invalid> | A
): a is Actions<Invalid> =>
  Object.values(ActionTypes).includes(a.type as ActionTypes);

const isNotActions = <Invalid extends State.St, A extends { type: string }>(
  a: Actions<Invalid> | A
): a is A => !isActions(a);

export const createReducer = <
  Invalid extends State.St,
  Valid extends Invalid,
  A extends { type: string }
>(
  reducer: (v: Invalid, a: A) => Invalid,
  validate: (v: Invalid) => Either<Invalid, Valid>
) => (
  s: State.State<Invalid, Valid>,
  a: Actions<Invalid> | A
): State.State<Invalid, Valid> => {
  return match(
    [
      isActions,
      (a: Actions<Invalid>): State.State<Invalid, Valid> => {
        switch (a.type) {
          case ActionTypes.FetchError:
            return s.type === "Loading"
              ? State.err({ ...s.payload, message: t("Something went wrong") })
              : s;
          case ActionTypes.FetchSuccess:
            return s.type === "Loading"
              ? State.ready({ ...a.payload, activeTab: s.payload.activeTab })
              : s;
          case ActionTypes.Save: {
            if (s.type === "Ready") {
              const r = validate(s.payload);
              switch (r.type) {
                case "left":
                  return State.ready(r.value);
                case "right":
                  return State.saving(r.value);
              }
            } else {
              return s;
            }
          }
          // eslint-disable-next-line no-fallthrough
          case ActionTypes.SaveError:
            return s.type === "Saving"
              ? State.ready({
                  ...s.payload,
                  error: t("Something went wrong")
                })
              : s;
          case ActionTypes.SaveSuccess:
            return s.type === "Saving" ? State.ready(s.payload) : s;
          case ActionTypes.SwitchTab:
            return s.type === "Ready"
              ? State.ready({ ...s.payload, activeTab: a.payload })
              : s.type === "Saving"
              ? State.saving({ ...s.payload, activeTab: a.payload })
              : s;
          case ActionTypes.Cancel: {
            switch (s.type) {
              case "Loading":
              case "Err":
              case "Canceling":
                return s;
              case "Ready":
              case "Saving":
                return State.canceling(s.payload);
            }
          }
          // eslint disable-next-line no-fallthrough, this is handled by type script
          case ActionTypes.Canceled:
            return s.type === "Canceling" ? State.canceled(s.payload) : s;
        }
      }
    ],
    [
      isNotActions,
      (a: A): State.State<Invalid, Valid> => {
        switch (s.type) {
          case "Loading":
          case "Err":
          case "Saving":
          case "Canceling":
          case "Canceled":
            return s;
          case "Ready":
            return State.ready(reducer(s.payload, a));
        }
      }
    ]
  )(a);
};
