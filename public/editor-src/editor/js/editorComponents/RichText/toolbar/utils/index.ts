export enum TypographyTags {
  P = "P",
  H1 = "H1",
  H2 = "H2",
  H3 = "H3",
  H4 = "H4",
  H5 = "H5",
  H6 = "H6"
}

export function tagId(tag: TypographyTags): string {
  switch (tag) {
    case TypographyTags.P:
      return "typography";
    case TypographyTags.H1:
      return "h1";
    case TypographyTags.H2:
      return "h2";
    case TypographyTags.H3:
      return "h3";
    case TypographyTags.H4:
      return "h4";
    case TypographyTags.H5:
      return "h5";
    case TypographyTags.H6:
      return "h6";
  }
}
