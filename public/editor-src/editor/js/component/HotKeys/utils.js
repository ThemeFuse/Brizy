import { invert } from "es-toolkit";

const isff =
  typeof navigator !== "undefined"
    ? navigator.userAgent.toLowerCase().indexOf("firefox") > 0
    : false;

// was taken from here https://github.com/jaywcjlove/hotkeys/blob/master/src/var.js
const _keyMap = {
  backspace: 8,
  tab: 9,
  clear: 12,
  enter: 13,
  return: 13,
  esc: 27,
  escape: 27,
  space: 32,
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  del: 46,
  delete: 46,
  ins: 45,
  insert: 45,
  home: 36,
  end: 35,
  pageup: 33,
  pagedown: 34,
  capslock: 20,
  minus: isff ? 173 : 189,
  plus: isff ? 61 : 187,
  right_minus: 109,
  right_plus: 107,
  "-": isff ? 173 : 189,
  "=": isff ? 61 : 187,
  "⇪": 20,
  ",": 188,
  ".": 190,
  "/": 191,
  "`": 192,
  ";": isff ? 59 : 186,
  "'": 222,
  "[": 219,
  "]": 221,
  "\\": 220
};

export const _modifier = {
  "⇧": 16,
  shift: 16,
  "⌥": 18,
  option: 18,
  alt: 18,
  "⌃": 17,
  control: 17,
  ctrl: 17,
  "⌘": isff ? 224 : 91,
  cmd: isff ? 224 : 91,
  command: isff ? 224 : 91,
  "right_⌘": 93,
  right_cmd: 93,
  right_command: 93
};

const _invertedKeyMap = invert(_keyMap);
const _invertedKeyModifier = invert(_modifier);

export const fromCode = (x) =>
  _invertedKeyMap[x] ||
  _invertedKeyModifier[x] ||
  String.fromCharCode(x).toUpperCase();

export const toCode = (x) =>
  _keyMap[x.toLowerCase()] ||
  _modifier[x.toLowerCase()] ||
  x.toUpperCase().charCodeAt(0);
