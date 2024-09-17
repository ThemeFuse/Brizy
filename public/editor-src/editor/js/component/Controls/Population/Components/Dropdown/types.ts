export interface Props {
  className?: string;
  isOpen: boolean;
  clickOutsideExceptions?: Array<string>;
  onOpened: (o: boolean) => void;
  children: JSX.Element;
}
