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
