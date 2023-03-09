import { mPipe } from "fp-utilities";
import React, {
  ChangeEvent,
  ReactElement,
  useCallback,
  useEffect,
  useReducer
} from "react";
import { from, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import { uploadFile } from "visual/utils/api";
import * as Ac from "../types/Actions";
import * as St from "../types/State";
import { Value, eq } from "../types/Value";

export interface Props {
  value: Value;
  extensions: string[];
  onChange: (v: Value) => void;
}

const valueToState = (v: Value): St.State =>
  v ? { type: "WithFile", file: v } : { type: "Empty" };

export function Uploader({ value, extensions, onChange }: Props): ReactElement {
  const [state, dispatch] = useReducer(
    (s: St.State, a: Ac.Actions): St.State => {
      switch (a.type) {
        case "Upload":
          return s.type === "Empty" ? St.loading(a.payload) : s;
        case "Err":
          return s.type === "Loading" ? St.err(a.payload) : s;
        case "Success":
          return s.type === "Loading"
            ? St.withFile({ id: a.payload.name, name: s.file.name })
            : s;
        case "Remove":
          return s.type === "WithFile" ? St.empty() : s;
        case "Reset":
          return a.payload ? St.withFile(a.payload) : St.empty();
      }
    },
    value,
    valueToState
  );

  const handleChange = useCallback(
    mPipe(
      (e: ChangeEvent<HTMLInputElement>) => e.target.files?.[0],
      Ac.upload,
      dispatch
    ),
    []
  );
  const handleRemove = useCallback(() => dispatch(Ac.remove()), []);

  useEffect(() => {
    if (state.type === "Loading") {
      const s = from(uploadFile(state.file))
        .pipe(
          map(Ac.success),
          catchError((e: Error) => of(Ac.err(e.message)))
        )
        .subscribe(dispatch);

      return () => s.unsubscribe();
    }
  }, [state.type === "Loading"]);

  useEffect(() => {
    if (state.type === "WithFile") {
      onChange(state.file);
    }
  }, [state.type === "WithFile"]);

  useEffect(() => {
    if (state.type === "Err") {
      ToastNotification.warn(state.message, 5);
    }
  }, [state.type === "Err"]);

  useEffect(() => {
    switch (state.type) {
      case "WithFile":
        !eq(value, state.file) && dispatch(Ac.reset(value));
        break;
      case "Empty":
      case "Err":
        value && dispatch(Ac.reset(value));
        break;
      case "Loading":
        dispatch(Ac.reset(value));
        break;
    }
  }, [value]);

  switch (state.type) {
    case "Empty":
    case "Err":
      return (
        <div className="brz-ed-control__file-upload__wrapper">
          <EditorIcon icon="nc-add" />
          <input
            type="file"
            onChange={handleChange}
            accept={extensions.join(",")}
          />
        </div>
      );
    case "Loading":
      return (
        <div className="brz-ed-control__file-upload__wrapper">
          <EditorIcon icon="nc-circle-02" className="brz-ed-animated--spin" />
        </div>
      );
    case "WithFile":
      return (
        <div className="brz-ed-control__file-upload__file-name">
          <span
            className="brz-ed-control__file-upload__file-name--title"
            title={state.file.name}
          >
            {state.file.name}
          </span>
          <span className="brz-ed-control__file-upload__file-name--remove">
            <EditorIcon icon="nc-remove" onClick={handleRemove} />
          </span>
        </div>
      );
  }
}
