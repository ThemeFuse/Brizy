export interface Props {
  iconName: string;
  iconType: "glyph" | "outline" | "fa";
  label: JSX.Element;
  rating: string;
  ratingScale: number;
  showLeftLabel: boolean;
  showRightLabel: boolean;
}
