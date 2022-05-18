declare module "react-resize-aware" {
  interface Props {
    onResize?: VoidFunction;
  }
  class ResizeAware extends React.Component<Props, unknown> {}

  export default ResizeAware;
}
