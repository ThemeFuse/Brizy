export interface IconProps {
  iconName: string;
  iconType: string;
  iconFilename: string;
  mMenu: boolean;
}

export interface ContainerProps extends IconProps {
  itemId: string;
  wrapInPlaceholder: boolean;
}
