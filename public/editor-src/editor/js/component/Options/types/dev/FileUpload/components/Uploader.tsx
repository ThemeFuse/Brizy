import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useReducer
} from "react";
import EditorIcon from "visual/component/EditorIcon";
import { ToastNotification } from "visual/component/Notifications";
import { WithValue } from "visual/component/Options/types/dev/FileUpload/types/Value";
import { ElementTypes } from "visual/global/Config/types/configs/ElementTypes";
import {
  FileUploadData,
  Response
} from "visual/global/Config/types/configs/common";
import { useConfig } from "visual/global/hooks";
import { t } from "visual/utils/i18n";
import {
  Actions,
  errPayload,
  remove,
  reset,
  success,
  upload
} from "../types/Actions";
import {
  Err,
  State,
  WithFile,
  empty,
  errMessage,
  loading,
  withFile
} from "../types/State";
import { Value, eq } from "../types/Value";

export interface Props {
  value: Value;
  extensions: string[];
  onChange: (v: Value | undefined) => void;
  componentId?: ElementTypes;
}

const validateValue = (v: Value) => {
  if (v?.id && v?.name) {
    return { id: v.id, name: v.name };
  }
  return undefined;
};

const valueToState = (v: Value): State =>
  v && validateValue(v) ? { type: "WithFile", file: v } : { type: "Empty" };

export function Uploader({
  value,
  extensions,
  componentId,
  onChange
}: Props): ReactElement {
  const config = useConfig();

  const [state, dispatch] = useReducer(
    (s: State, a: Actions): State => {
      switch (a.type) {
        case "Upload":
          return s.type === "Empty" || s.type === "Err" ? loading() : s;
        case "Err":
          return s.type === "Loading" ? errMessage(a.payload) : s;
        case "Success":
          return s.type === "Loading"
            ? withFile({ id: a.payload.id, name: a.payload.name })
            : s;
        case "Remove":
          return s.type === "WithFile" ? empty() : s;
        case "Reset":
          return a.payload && validateValue(a.payload)
            ? withFile(a.payload)
            : empty();
      }
    },
    value,
    valueToState
  );

  const handleChange = useCallback(() => {
    dispatch(upload());
  }, []);

  const handleRemove = useCallback(() => dispatch(remove()), []);

  const { type } = state;
  const { file } = state as WithFile;
  const { message } = state as Err;

  const isLoading = useMemo(() => type === "Loading", [type]);
  const isWithFile = useMemo(() => type === "WithFile", [type]);
  const isEmpty = useMemo(() => type === "Empty", [type]);
  const isErr = useMemo(() => type === "Err", [type]);

  const customFile = config.api?.customFile;

  useEffect(() => {
    if (isLoading && customFile) {
      if (!customFile.addFile) {
        ToastNotification.error(t("Config : Missing addFile callback"));
        return;
      }

      const response: Response<FileUploadData> = ({ uid, filename }) => {
        const file: WithValue = { id: uid, name: filename };
        dispatch(success(file));
      };
      const reject: Response<string> = (message) => {
        dispatch(errPayload(message));
      };

      customFile.addFile.handler(response, reject, {
        acceptedExtensions: extensions,
        componentId
      });
    }
  }, [isLoading, extensions, componentId, customFile]);

  useEffect(() => {
    if (isWithFile) {
      onChange(file);
    }
  }, [onChange, file, isWithFile]);

  useEffect(() => {
    if (isEmpty) {
      onChange(undefined);
    }
  }, [isEmpty, onChange]);

  useEffect(() => {
    if (isErr) {
      ToastNotification.warn(message, 5);
    }
  }, [isErr, message]);

  useEffect(() => {
    switch (type) {
      case "WithFile":
        !eq(value, file) && dispatch(reset(value));
        break;
      case "Empty":
      case "Err":
        value && dispatch(reset(value));
        break;
      case "Loading":
        dispatch(reset(value));
        break;
    }
    // type, file dependency are not nedded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  switch (type) {
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
            title={file.name}
          >
            {file.name}
          </span>
          <span className="brz-ed-control__file-upload__file-name--remove">
            <EditorIcon icon="nc-remove" onClick={handleRemove} />
          </span>
        </div>
      );
  }
}
