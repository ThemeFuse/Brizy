import React from "react";
import { Slide, toast } from "react-toastify";
import EditorIcon from "visual/component/EditorIcon";

function generateOptions(hideAfter = 3) {
  return {
    position: toast.POSITION.TOP_CENTER,
    autoClose: hideAfter * 1000,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    transition: Slide,
    closeButton: false,
    icon: <EditorIcon icon="nc-info" />
  };
}

export const ToastNotification = {
  error: (message: string, hideAfter?: number) => {
    toast.error(message, generateOptions(hideAfter));
  },
  success: (message: string, hideAfter?: number) => {
    toast.success(message, generateOptions(hideAfter));
  },
  info: (message: string, hideAfter?: number) => {
    toast.info(message, generateOptions(hideAfter));
  },
  warn: (message: string, hideAfter?: number) => {
    toast.warn(message, generateOptions(hideAfter));
  }
};
