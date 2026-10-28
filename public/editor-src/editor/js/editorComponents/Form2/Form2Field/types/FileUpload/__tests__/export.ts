// The file field of a published Form2.

import { uploadField } from "visual/editorComponents/Form2/__fixtures__/form";
import uploadExport from "visual/editorComponents/Form2/Form2Field/types/FileUpload/export";
import {
  clearPage,
  click,
  mount,
  query,
  queryAll,
  queryInput,
  queryNode
} from "visual/libs/select2/__fixtures__/env";
import {
  stopClicksAt,
  trackClickListeners
} from "../../../../../../../../jest-utils/exportRuntime";

beforeEach(() => {
  clearPage();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  clearPage();
});

interface Upload {
  input: HTMLInputElement;
  state: () => {
    text: string | null;
    button: boolean;
    remove: boolean;
    disabled: boolean;
  };
  pick: (files: File[]) => void;
  remove: VoidFunction;
}

const fieldHtml = (label: string): string =>
  uploadField({
    label,
    placeholder: "Add a file",
    accept: ".txt",
    maxSize: "5"
  });

function uploadOf(node: HTMLElement): Upload {
  const input = queryInput(node, "input[type=file]");

  return {
    input,
    state: () => ({
      text: query(node, ".brz-span").textContent,
      button: !query(node, ".brz-button").classList.contains("brz-hidden"),
      remove: !queryNode(node, ".brz-input__upload-delete").classList.contains(
        "brz-hidden"
      ),
      disabled: input.disabled
    }),
    pick: (files) => {
      Object.defineProperty(input, "files", {
        configurable: true,
        value: files
      });
      input.dispatchEvent(new Event("change", { bubbles: true }));
    },
    remove: () => click(queryNode(node, ".brz-input__upload-delete"))
  };
}

function upload(): Upload {
  const root = mount(fieldHtml("Resume"));

  uploadExport(root);

  return uploadOf(root);
}

const EMPTY = {
  text: "Add a file",
  button: true,
  remove: false,
  disabled: false
};

describe("the file field", () => {
  it("starts with its placeholder and the choose button", () => {
    const { state } = upload();

    expect(state()).toEqual(EMPTY);
  });

  it("shows the name of the chosen file and offers to remove it", () => {
    const { state, pick } = upload();

    pick([new File(["hello"], "resume.txt")]);

    expect(state()).toEqual({
      text: "resume.txt",
      button: false,
      remove: true,
      disabled: true
    });
  });

  it("goes back to its placeholder when the file is removed", () => {
    const { state, pick, remove, input } = upload();

    pick([new File(["hello"], "resume.txt")]);
    remove();

    expect(state()).toEqual({ ...EMPTY, disabled: true });
    expect(input.value).toBe("");

    jest.advanceTimersByTime(499);
    expect(state().disabled).toBe(true);

    jest.advanceTimersByTime(1);
    expect(state()).toEqual(EMPTY);
  });

  it("goes back to its placeholder when the choice is cancelled", () => {
    const { state, pick } = upload();

    pick([new File(["hello"], "resume.txt")]);
    pick([]);

    expect(state()).toEqual({ ...EMPTY, disabled: true });

    jest.advanceTimersByTime(500);

    expect(state()).toEqual(EMPTY);
  });

  it("is removed after a second file was chosen", () => {
    const { state, pick, remove } = upload();

    pick([new File(["hello"], "resume.txt")]);
    pick([new File(["hello"], "cover.txt")]);
    remove();

    expect(state()).toEqual({ ...EMPTY, disabled: true });

    jest.advanceTimersByTime(500);

    expect(state()).toEqual(EMPTY);
  });

  it("is back to its placeholder when the click on remove reaches the page around it", () => {
    const root = mount(fieldHtml("Resume"));
    uploadExport(root);
    const { state, pick, remove } = uploadOf(root);
    const seen = stopClicksAt(root, state);

    pick([new File(["hello"], "resume.txt")]);
    remove();

    expect(seen).toEqual([{ ...EMPTY, disabled: true }]);
    expect(state()).toEqual({ ...EMPTY, disabled: true });
  });

  it("keeps two file fields of one page apart", () => {
    const root = mount(`${fieldHtml("Resume")}${fieldHtml("Cover")}`);
    uploadExport(root);
    const [first, second] = queryAll(root, ".brz-input__upload").map(uploadOf);

    first?.pick([new File(["hello"], "resume.txt")]);
    second?.pick([new File(["hello"], "cover.txt")]);
    second?.remove();

    expect([first?.state(), second?.state()]).toEqual([
      { text: "resume.txt", button: false, remove: true, disabled: true },
      { ...EMPTY, disabled: true }
    ]);
  });

  it("listens for the remove clicks of every field with one listener on body", () => {
    const root = mount(`${fieldHtml("Resume")}${fieldHtml("Cover")}`);
    const listeners = trackClickListeners();
    uploadExport(root);
    const fields = queryAll(root, ".brz-input__upload").map(uploadOf);
    fields.forEach((field) => {
      field.pick([new File(["hello"], "resume.txt")]);
      field.pick([new File(["hello"], "cover.txt")]);
    });
    const targets = listeners.targets();
    listeners.restore();

    expect(targets).toEqual([document.body]);
  });
});
