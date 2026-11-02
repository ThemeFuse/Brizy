import { readDataAttr } from "visual/utils/export/dataAttr";
import { onBodyClick } from "visual/utils/export/delegate";

const previousDisplay = new WeakMap();

const isHidden = (element) =>
  element.style.display === "none" ||
  (element.style.display === "" &&
    element.isConnected &&
    getComputedStyle(element).display === "none");

// The display an element of this kind has when nothing hides it.
function defaultDisplay(element) {
  const { body } = element.ownerDocument;
  const sample = body.appendChild(
    element.ownerDocument.createElement(element.nodeName)
  );
  const display = getComputedStyle(sample).display;

  sample.remove();

  return display === "none" ? "block" : display;
}

function hide(element) {
  const display = element.style.display;

  if (display !== "none") {
    previousDisplay.set(element, display);
    element.style.display = "none";
  }
}

function show(element) {
  let display;

  if (element.style.display === "none") {
    display = previousDisplay.get(element) || undefined;

    if (!display) {
      element.style.display = "";
    }
  }

  if (element.style.display === "" && isHidden(element)) {
    display = defaultDisplay(element);
  }

  if (display !== undefined) {
    element.style.display = display;
  }
}

const within = (parents, selector) =>
  parents.flatMap((parent) => [...parent.querySelectorAll(selector)]);

export default function (node) {
  const selects = new Map();

  node.querySelectorAll(".brz-control__select").forEach((select) => {
    const currentWraps = [
      ...select.querySelectorAll(".brz-control__select-current")
    ];
    const currentOptions = within(currentWraps, ".brz-control__select-option");
    const lists = [...select.querySelectorAll(".brz-control__select-options")];
    const options = within(lists, ".brz-control__select-option");
    const inputs = [...select.querySelectorAll("input[type=hidden]")];

    selects.set(select, { currentOptions, lists, inputs });

    // Reset Select to defaultValue when trigger onChange
    inputs.forEach((input) => {
      input.addEventListener("change", () => {
        const [first] = options;

        if (first) {
          currentOptions.forEach((current) => {
            current.innerHTML = first.innerHTML;
          });
        }

        input.value = "";
      });
    });

    window.addEventListener("click", (e) => {
      if (!(e.target instanceof Node && select.contains(e.target))) {
        lists.forEach(hide);
      }
    });
  });

  onBodyClick([
    {
      selector: ".brz-control__select-current",
      handler: (wrap) => {
        const state = selects.get(wrap.closest(".brz-control__select"));

        if (!state) {
          return;
        }

        state.lists.forEach((list) => {
          if (isHidden(list)) {
            show(list);
          } else {
            hide(list);
          }
        });
      }
    },
    {
      selector: ".brz-control__select-options .brz-control__select-option",
      handler: (option) => {
        const state = selects.get(option.closest(".brz-control__select"));

        if (!state) {
          return;
        }

        const { currentOptions, lists, inputs } = state;

        [...(option.parentElement?.children ?? [])].forEach((sibling) => {
          sibling.classList.remove("active");
        });
        option.classList.add("active");

        const value = readDataAttr(option, "value");

        inputs.forEach((input) => {
          input.value = value === undefined ? "" : String(value);
        });
        currentOptions.forEach((current) => {
          current.innerHTML = option.innerHTML;
        });
        lists.forEach(hide);
      }
    }
  ]);
}
