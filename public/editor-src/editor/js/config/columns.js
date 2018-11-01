import _ from "underscore";

export const maxWidth = 36;

export const widthToClassNames = {
  "1": "col-xs-36 col-sm-1 col-md-1",
  "2": "col-xs-36 col-sm-2 col-md-2",
  "3": "col-xs-36 col-sm-3 col-md-3",
  "4": "col-xs-36 col-sm-4 col-md-4",
  "5": "col-xs-36 col-sm-5 col-md-5",
  "6": "col-xs-36 col-sm-6 col-md-6",
  "7": "col-xs-36 col-sm-7 col-md-7",
  "8": "col-xs-36 col-sm-8 col-md-8",
  "9": "col-xs-36 col-sm-9 col-md-9",
  "10": "col-xs-36 col-sm-10 col-md-10",
  "11": "col-xs-36 col-sm-11 col-md-11",
  "12": "col-xs-36 col-sm-12 col-md-12",
  "13": "col-xs-36 col-sm-13 col-md-13",
  "14": "col-xs-36 col-sm-14 col-md-14",
  "15": "col-xs-36 col-sm-15 col-md-15",
  "16": "col-xs-36 col-sm-16 col-md-16",
  "17": "col-xs-36 col-sm-17 col-md-17",
  "18": "col-xs-36 col-sm-18 col-md-18",
  "19": "col-xs-36 col-sm-19 col-md-19",
  "20": "col-xs-36 col-sm-20 col-md-20",
  "21": "col-xs-36 col-sm-21 col-md-21",
  "22": "col-xs-36 col-sm-22 col-md-22",
  "23": "col-xs-36 col-sm-23 col-md-23",
  "24": "col-xs-36 col-sm-24 col-md-24",
  "25": "col-xs-36 col-sm-25 col-md-25",
  "26": "col-xs-36 col-sm-26 col-md-26",
  "27": "col-xs-36 col-sm-27 col-md-27",
  "28": "col-xs-36 col-sm-28 col-md-28",
  "29": "col-xs-36 col-sm-29 col-md-29",
  "30": "col-xs-36 col-sm-30 col-md-30",
  "31": "col-xs-36 col-sm-31 col-md-31",
  "32": "col-xs-36 col-sm-32 col-md-32",
  "33": "col-xs-36 col-sm-33 col-md-33",
  "34": "col-xs-36 col-sm-34 col-md-34",
  "35": "col-xs-36 col-sm-35 col-md-35",
  "36": "col-xs-36"
};

export const maxWidthClassName = widthToClassNames[maxWidth];

export const widthToClassNamesSmallScreen = {
  "1": "col-xs-1",
  "2": "col-xs-2",
  "3": "col-xs-3",
  "4": "col-xs-4",
  "5": "col-xs-5",
  "6": "col-xs-6",
  "7": "col-xs-7",
  "8": "col-xs-8",
  "9": "col-xs-9",
  "10": "col-xs-10",
  "11": "col-xs-11",
  "12": "col-xs-12",
  "13": "col-xs-13",
  "14": "col-xs-14",
  "15": "col-xs-15",
  "16": "col-xs-16",
  "17": "col-xs-17",
  "18": "col-xs-18",
  "19": "col-xs-19",
  "20": "col-xs-20",
  "21": "col-xs-21",
  "22": "col-xs-22",
  "23": "col-xs-23",
  "24": "col-xs-24",
  "25": "col-xs-25",
  "26": "col-xs-26",
  "27": "col-xs-27",
  "28": "col-xs-28",
  "29": "col-xs-29",
  "30": "col-xs-30",
  "31": "col-xs-31",
  "32": "col-xs-32",
  "33": "col-xs-33",
  "34": "col-xs-34",
  "35": "col-xs-35",
  "36": "col-xs-36"
};

const getClassName = (classNamesArray, width) => {
  const classNamesLength = _.keys(classNamesArray).length;
  const w = Math.round(width * classNamesLength / 100);

  return classNamesArray[w];
};

export const maxWidthClassNameSmallScreen =
  widthToClassNamesSmallScreen[maxWidth];

export const convertWidthToClassNamesSmallScreen = width =>
  getClassName(widthToClassNamesSmallScreen, width);

export const convertWidthToClassNames = width =>
  getClassName(widthToClassNames, width);

// w
export const wInBoxedPage = 1170; // container(1170px)

export const wInFullPage = 1920; // full width page

export const wInTabletPage = 768; // tablet page

export const wInMobilePage = 430; // mobile page

export const minWinColumn = 760; // min w in column

export const MIN_COL_WIDTH = 60;
