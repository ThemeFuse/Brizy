import { ReduxState } from "visual/redux/types";
import { GoogleFont, UploadedFont } from "visual/types/Fonts";
import { compareFont, sortFonts } from "../utils";

const googleFonts: GoogleFont[] = [
  {
    family: "Cutive",
    variants: ["regular"],
    subsets: ["latin", "latin-ext"],
    version: "v12",
    lastModified: "2020-07-23",
    files: {
      regular:
        "http://fonts.gstatic.com/s/cutive/v12/NaPZcZ_fHOhV3Ip7T_hDoyqlZQ.ttf"
    },
    category: "serif",
    kind: "webfonts#webfont",
    brizyId: "someid"
  },
  {
    family: "Alex Brush",
    variants: ["regular"],
    subsets: ["latin", "latin-ext"],
    version: "v12",
    lastModified: "2020-09-02",
    files: {
      regular:
        "http://fonts.gstatic.com/s/alexbrush/v12/SZc83FzrJKuqFbwMKk6EtUL57DtOmCc.ttf"
    },
    category: "handwriting",
    kind: "webfonts#webfont",
    brizyId: "someid2"
  },
  {
    family: "ABeeZee",
    variants: ["regular", "italic"],
    subsets: ["latin"],
    version: "v14",
    lastModified: "2020-09-02",
    files: {
      regular:
        "http://fonts.gstatic.com/s/abeezee/v14/esDR31xSG-6AGleN6tKukbcHCpE.ttf",
      italic:
        "http://fonts.gstatic.com/s/abeezee/v14/esDT31xSG-6AGleN2tCklZUCGpG-GQ.ttf"
    },
    category: "sans-serif",
    kind: "webfonts#webfont",
    brizyId: "someid3"
  }
];

const uploadFonts: UploadedFont[] = [
  {
    id: "qfsxairqravkufdbhgxvwsjkuhxvsicpyjtq",
    family: "Bilbo",
    type: "uploaded",
    weights: ["400"],
    brizyId: "nxykmhcxhbidcbbwzvbxykbnqencugmoqfbo"
  },
  {
    brizyId: "aiwqtincskstwwxanzpigwlnkfodocpwpktf",
    id: "ppfjewcxsmukdxegjjsduionjxiolvvemddp",
    family: "Alex C",
    type: "uploaded",
    weights: ["400"]
  }
];

const fontState: ReduxState["fonts"] = {
  config: {
    data: googleFonts
  },
  upload: {
    data: uploadFonts
  }
};

const sortedFonts = [
  {
    family: "ABeeZee",
    variants: ["regular", "italic"],
    subsets: ["latin"],
    version: "v14",
    lastModified: "2020-09-02",
    files: {
      regular:
        "http://fonts.gstatic.com/s/abeezee/v14/esDR31xSG-6AGleN6tKukbcHCpE.ttf",
      italic:
        "http://fonts.gstatic.com/s/abeezee/v14/esDT31xSG-6AGleN2tCklZUCGpG-GQ.ttf"
    },
    category: "sans-serif",
    kind: "webfonts#webfont",
    brizyId: "someid3",
    fontGroupType: "config"
  },
  {
    family: "Alex Brush",
    variants: ["regular"],
    subsets: ["latin", "latin-ext"],
    version: "v12",
    lastModified: "2020-09-02",
    files: {
      regular:
        "http://fonts.gstatic.com/s/alexbrush/v12/SZc83FzrJKuqFbwMKk6EtUL57DtOmCc.ttf"
    },
    category: "handwriting",
    kind: "webfonts#webfont",
    brizyId: "someid2",
    fontGroupType: "config"
  },
  {
    brizyId: "aiwqtincskstwwxanzpigwlnkfodocpwpktf",
    id: "ppfjewcxsmukdxegjjsduionjxiolvvemddp",
    family: "Alex C",
    type: "uploaded",
    weights: ["400"],
    fontGroupType: "upload"
  },
  {
    id: "qfsxairqravkufdbhgxvwsjkuhxvsicpyjtq",
    family: "Bilbo",
    type: "uploaded",
    weights: ["400"],
    brizyId: "nxykmhcxhbidcbbwzvbxykbnqencugmoqfbo",
    fontGroupType: "upload"
  },
  {
    family: "Cutive",
    variants: ["regular"],
    subsets: ["latin", "latin-ext"],
    version: "v12",
    lastModified: "2020-07-23",
    files: {
      regular:
        "http://fonts.gstatic.com/s/cutive/v12/NaPZcZ_fHOhV3Ip7T_hDoyqlZQ.ttf"
    },
    category: "serif",
    kind: "webfonts#webfont",
    brizyId: "someid",
    fontGroupType: "config"
  }
];

test("Testing 'compareFont' function", () => {
  const [cutiveFont, alexBrushFont] = googleFonts;
  expect(compareFont(cutiveFont, alexBrushFont)).toBe(1);
  expect(compareFont(alexBrushFont, cutiveFont)).toBe(-1);
  expect(compareFont(cutiveFont, cutiveFont)).toBe(0);
});

test("Testing 'sortFonts' function", () => {
  expect(sortFonts(fontState)).toEqual(sortedFonts);
});
