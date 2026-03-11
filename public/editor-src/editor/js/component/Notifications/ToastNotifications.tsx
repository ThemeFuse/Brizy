import React from "react";
import { Slide, ToastOptions, toast } from "react-toastify";
import { SVGInfo } from "./icons";

function generateOptions(hideAfter = 3): ToastOptions {
  return {
    position: "top-center",
    autoClose: hideAfter * 1000,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: 0,
    transition: Slide,
    closeButton: false,
    isLoading: false,
    icon: <SVGInfo />
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
