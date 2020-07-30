import React, { Component } from "react";
import _ from "underscore";
import classnames from "classnames";
import { t } from "visual/utils/i18n";

const keyCodes = {
  ENTER: 13,
  B: 66,
  I: 73,
  U: 85,
  V: 86,
  Y: 89,
  Z: 90
};

type Props = {
  value?: string;
  tagName?: keyof JSX.IntrinsicElements;
  className?: string;
  onChange: (v: string) => void;
};
type DefaultProps = Omit<Required<Props>, "onChange">;
type State = {
  value: string;
};

export class TextEditor extends Component<Props, State> {
  static defaultProps: DefaultProps = {
    // TODO: refactor value prop name to defaultValue because
    // this is essentially an uncontrolled component at the moment
    value: t("Editable Text"),
    tagName: "span",
    className: ""
  };

  contentRef = React.createRef<HTMLElement>();

  unmounted = false;

  lastNotifiedValue: string | undefined;

  shouldComponentUpdate(nextProps: Props): boolean {
    return (
      this.lastNotifiedValue !== undefined &&
      this.lastNotifiedValue !== nextProps.value
    );
  }

  componentDidUpdate(): void {
    this.lastNotifiedValue = this.props.value;

    // this code shouldn't be here because
    // at componentDidUpdate the value in the DOM
    // should be equal to this.props.value
    // but somehow that isn't always the case
    const content = this.contentRef.current;
    if (content && content.textContent !== this.lastNotifiedValue) {
      content.textContent = this.lastNotifiedValue ?? "";
    }
  }

  componentWillUnmount(): void {
    this.unmounted = true;
  }

  handleClick = (e: React.MouseEvent): void => {
    e.preventDefault();

    const node = this.contentRef.current;

    // issue - https://github.com/bagrinsergiu/blox-editor/issues/1848
    // What does it need for?
    // node.setAttribute("contentEditable", "true");
    node?.classList.add("brz-ed-dd-cancel");
    // node.focus();
  };

  handleKeyDown = (e: React.KeyboardEvent): void => {
    const keyCode = e.which;
    const holdsMeta = e.metaKey || e.ctrlKey;

    // prevent enter
    if (keyCode === keyCodes.ENTER) {
      e.preventDefault();
      return;
    }

    // prevent paste
    if (holdsMeta && keyCode === keyCodes.V) {
      e.preventDefault();
      return;
    }

    // prevent ctrl + {B,I,U}
    if (
      holdsMeta &&
      (keyCode === keyCodes.B ||
        keyCode === keyCodes.I ||
        keyCode === keyCodes.U)
    ) {
      e.preventDefault();
      return;
    }

    // prevent undo / redo
    if (holdsMeta && (keyCode === keyCodes.Z || keyCode === keyCodes.Y)) {
      e.preventDefault();
      return;
    }
  };

  handleInput = (e: React.KeyboardEvent): void => {
    this.notifyChange(e.currentTarget.textContent || "");
  };

  notifyChange = _.debounce((value: string): void => {
    if (!this.unmounted) {
      this.lastNotifiedValue = value;
      this.props.onChange(value);
    }
  }, 1000);

  handleBlur = (): void => {
    this.contentRef.current?.classList.remove("brz-ed-dd-cancel");
  };

  render(): React.ReactElement {
    const { tagName, value, className: className_ } = this.props as Props &
      DefaultProps;
    const className = classnames(
      className_,
      `brz-${tagName}`,
      "brz-text__editor"
    );

    return React.createElement(tagName, {
      ref: this.contentRef,
      className: className,
      contentEditable: IS_EDITOR ? true : undefined,
      dangerouslySetInnerHTML: { __html: value },
      onClick: this.handleClick,
      onKeyDown: this.handleKeyDown,
      onInput: this.handleInput,
      onBlur: this.handleBlur
    });
  }
}
