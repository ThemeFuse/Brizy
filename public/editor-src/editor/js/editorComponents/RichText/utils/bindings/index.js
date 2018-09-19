import { Delta, Keyboard } from "../quill";

const handleEnter = function({ index, length }, context) {
  const { prepopulation, population } = this.quill.getFormat();
  if (prepopulation || population) {
    return;
  }
  if (length === 0) {
    const [{ domNode: elem }, offset] = this.quill.getLine(index);
    const currentTextLength = elem.textContent.length;

    let delta;
    let selectionOffset;
    // enter was triggered in the end of line
    if (currentTextLength === offset) {
      delta = new Delta().retain(index + 1).insert(" \n", context.format);
      selectionOffset = index + 1;
      // enter was triggered in the middle of line
    } else if (offset > 0) {
      delta = new Delta().retain(index).insert("\n", context.format);
      selectionOffset = index + 1;
      // enter was triggered in the start of line
    } else {
      delta = new Delta().retain(index).insert(" \n", context.format);
      selectionOffset = index + 2;
    }

    this.quill.updateContents(delta);
    this.quill.setSelection(selectionOffset, 0);

    return;
  }

  return true;
};

const handleBackspace = function({ index, length }, context) {
  const lines = this.quill.getLines(index, length);
  const [{ domNode: elem }, offset] = this.quill.getLine(index);
  const currentTextLength = elem.textContent.length;

  if (this.quill.container.textContent) {
    if (currentTextLength === length || lines.length > 1) {
      this.quill.deleteText(index, length);
      this.quill.updateContents(
        new Delta().retain(index).insert(" ", context.format)
      );
      return;
    }
    if (currentTextLength === 1) {
      // Check for astral symbols
      let length = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix)
        ? 2
        : 1;
      this.quill.deleteText(index - length, length);
      if (offset > 0) {
        this.quill.updateContents(
          new Delta().retain(index - 1).insert(" ", context.format)
        );
      }
      return;
    }
  }

  return true;
};

const handleDelete = function({ index, length }, context) {
  const lines = this.quill.getLines(index, length);
  const [{ domNode: elem }, offset] = this.quill.getLine(index);
  const currentText = elem.textContent;

  if (
    !this.quill.container.textContent.trim() &&
    this.quill.container.textContent.length === 1
  ) {
    return;
  }

  if (this.quill.container.textContent) {
    if (currentText.length === length || lines.length > 1) {
      this.quill.deleteText(index, length);
      this.quill.updateContents(
        new Delta().retain(index).insert(" ", context.format)
      );

      return;
    }

    if (
      offset === 0 &&
      currentText.length === 1 &&
      currentText.replace(/ /gi, "").length === 0
    ) {
      this.quill.deleteText(index, 2);

      return;
    }

    if (offset === 0 && currentText.length === 1) {
      this.quill.deleteText(index, 1);
      this.quill.updateContents(
        new Delta().retain(index).insert(" ", context.format)
      );

      return;
    }
  }

  return true;
};

const handleArrowChange = function() {
  const { prepopulation, population } = this.quill.getFormat();

  return !prepopulation && !population;
};

const bindings = IS_EDITOR
  ? {
      enter: {
        key: Keyboard.keys.ENTER,
        handler: handleEnter
      },
      "header enter": handleEnter,
      backspace: {
        key: Keyboard.keys.BACKSPACE,
        handler: handleBackspace
      },
      delete: {
        key: Keyboard.keys.DELETE,
        handler: handleDelete
      },
      arrowUp: {
        key: 38,
        handler: handleArrowChange
      },
      arrowDown: {
        key: 40,
        handler: handleArrowChange
      }
    }
  : {};

export default bindings;
