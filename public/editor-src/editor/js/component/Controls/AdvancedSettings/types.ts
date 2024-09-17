interface Common {
  title?: string;
  helper?: boolean;
  helperContent?: string;
  className?: string;
}

interface Label {
  label: string;
}

export interface Props extends Common, IconProps, Label {
  attr?: { className?: string };
}

export interface LabelProps extends Label {
  helperContent?: string;
}

export interface IconProps {
  icon: string;
}

export interface IconLabel extends IconProps, Common, Label {
  onClick: VoidFunction;
}
