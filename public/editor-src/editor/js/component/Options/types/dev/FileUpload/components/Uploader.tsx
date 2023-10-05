import React, { ReactElement, useCallback, useEffect, useReducer } from "react";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import { WithValue } from "visual/component/Options/types/dev/FileUpload/types/Value";
import Config from "visual/global/Config";
import {
  FileUploadData,
  Response
} from "visual/global/Config/types/configs/common";
import { t } from "visual/utils/i18n";
import * as Ac from "../types/Actions";
import * as St from "../types/State";
import { Value, eq } from "../types/Value";

export interface Props {
  value: Value;
  extensions: string[];
  onChange: (v: Value | undefined) => void;
}

const valueToState = (v: Value): St.State =>
  v ? { type: "WithFile", file: v } : { type: "Empty" };

export function Uploader({ value, extensions, onChange }: Props): ReactElement {
  const [state, dispatch] = useReducer(
    (s: St.State, a: Ac.Actions): St.State => {
      switch (a.type) {
        case "Upload":
          return s.type === "Empty" || s.type === "Err" ? St.loading() : s;
        case "Err":
          return s.type === "Loading" ? St.err(a.payload) : s;
        case "Success":
          return s.type === "Loading"
            ? St.withFile({ id: a.payload.id, name: a.payload.name })
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

  const handleChange = useCallback(() => {
    dispatch(Ac.upload());
  }, []);

  const handleRemove = useCallback(() => dispatch(Ac.remove()), []);

  useEffect(() => {
    if (state.type === "Loading") {
      const { api = {} } = Config.getAll();
      const { customFile = {} } = api;

      if (!customFile.addFile) {
        ToastNotification.error(t("Config : Missing addFile callback"));
        return;
      }

      const response: Response<FileUploadData> = ({ uid, filename }) => {
        const file: WithValue = { id: uid, name: filename };
        dispatch(Ac.success(file));
      };
      const reject: Response<string> = (message) => {
        dispatch(Ac.err(message));
      };

      customFile.addFile.handler(response, reject, {
        acceptedExtensions: extensions
      });
    }
  }, [state.type === "Loading"]);

  useEffect(() => {
    if (state.type === "WithFile") {
      onChange(state.file);
    }
  }, [state.type === "WithFile"]);

  useEffect(() => {
    if (state.type === "Empty") {
      onChange(undefined);
    }
  }, [state.type === "Empty"]);

  useEffect(() => {
    if (state.type === "Err") {
      ToastNotification.warn(state.message, 5);
    }
  }, [state.type === "Err"]);

  useEffect(() => {
    if (state.type === "Empty") {
      onChange(undefined);
    }
  }, [state.type, onChange]);

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
        <div
          className="brz-ed-control__file-upload__wrapper"
          onClick={handleChange}
        >
          <EditorIcon icon="nc-add" />
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
