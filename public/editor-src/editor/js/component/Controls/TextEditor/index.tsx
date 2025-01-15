import classnames from "classnames";
import React, { Component, forwardRef } from "react";
import _ from "underscore";
import { Translate } from "visual/component/Translate";
import { useTranslation } from "visual/providers/I18nProvider";
import { renderHOC } from "visual/providers/RenderProvider/renderHOC";
import { t } from "visual/utils/i18n";
import { DefaultProps, Props, State } from "./types";

const keyCodes = {
  ENTER: 13,
  B: 66,
  I: 73,
  U: 85,
  V: 86,
  Y: 89,
  Z: 90
};

interface ControlProps {
  value?: string;
  tagName?: keyof JSX.IntrinsicElements;
  contentEditable?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLElement>;
  onPaste?: React.ClipboardEventHandler<HTMLElement>;
  onBlur?: React.FocusEventHandler<HTMLElement>;
}

const Control = forwardRef<HTMLElement, ControlProps>((props, ref) => {
  const { t } = useTranslation();
  const {
    tagName = "span",
    className: className_,
    value = t("Editable Text"),
    onClick,
    onKeyDown,
    onPaste,
    onBlur,
    contentEditable
  } = props;
  const className = classnames(
    className_,
    `brz-${tagName}`,
    "brz-text__editor"
  );

  return (
    <Translate
      tagName={tagName}
      ref={ref}
      className={className}
      contentEditable={contentEditable}
      dangerouslySetInnerHTML={{ __html: value }}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      onBlur={onBlur}
    />
  );
});

export class _TextEditor extends Component<Props, State> {
  static defaultProps: Props = {
    tagName: "span",
    className: "",
    allowLineBreak: false,
    onChange: _.noop
  };

  contentRef = React.createRef<HTMLElement>();

  unmounted = false;

  lastNotifiedValue: string | undefined;

  shouldComponentUpdate(nextProps: Props): boolean {
    return (
      this.lastNotifiedValue !== nextProps.value ||
      this.props.tagName !== nextProps.tagName ||
      this.props.className !== nextProps.className
    );
  }

  componentDidMount(): void {
    const element = this.contentRef.current;

    if (element !== null) {
      this.lastNotifiedValue = this.props.value ?? t("Editable Text");
      element.addEventListener("input", this.handleInput);
    }
  }

  componentDidUpdate(): void {
    this.lastNotifiedValue = this.props.value ?? t("Editable Text");

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
      if (!this.props.allowLineBreak) {
        e.preventDefault();
      }

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

  handleInput = (e: Event): void => {
    const node = e.currentTarget as HTMLElement;

    // Use innerHTML to include <br> tags
    const insertLineBreak = this.props.allowLineBreak
      ? node.innerHTML
      : node.textContent;

    this.notifyChange(insertLineBreak || "");
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

  handlePaste = (e: React.ClipboardEvent): void => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");

    document.execCommand("insertHTML", false, text);
  };

  render(): React.ReactElement {
    const {
      tagName,
      value = t("Editable Text"),
      className
    } = this.props as Props & DefaultProps;

    return (
      <Control
        ref={this.contentRef}
        className={className}
        value={value}
        tagName={tagName}
        contentEditable={true}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        onPaste={this.handlePaste}
        onBlur={this.handleBlur}
      />
    );
  }
}

export const TextEditor = renderHOC<Props>({
  ForEdit: (props) => <_TextEditor {...props} />,
  ForView: (props) => <Control {...props} />
});
