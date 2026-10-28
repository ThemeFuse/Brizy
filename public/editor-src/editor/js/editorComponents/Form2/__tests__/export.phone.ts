// The phone field of a published Form2: the country code beside the flag follows the chosen country.

import SlimSelect from "slim-select";
import { z } from "zod";
import { freshGroup1 } from "visual/libs/select2/__fixtures__/driver";
import {
  clearPage,
  click,
  mount,
  query,
  queryAll,
  queryInput,
  stubScrollIntoView,
  type
} from "visual/libs/select2/__fixtures__/env";
import {
  settleTransport,
  stubTransport
} from "../../../../../jest-utils/formTransport";
import { publishLibGroup } from "../../../../../jest-utils/libGroups";
import { ACTION, form2, phoneField } from "../__fixtures__/form";

// Not useGroup1Env: its fixed Math.random gives every SlimSelect option the same id.
beforeEach(async () => {
  clearPage();
  stubScrollIntoView();
  await freshGroup1();
});

afterEach(() => {
  jest.restoreAllMocks();
  clearPage();
});

const COUNTRIES = [
  { code: "MD", dialCode: "+373", name: "Moldova" },
  { code: "RO", dialCode: "+40", name: "Romania" },
  { code: "US", dialCode: "+1", name: "United States" }
];

interface Shown {
  code: string | undefined;
  flag: string | undefined;
  dialCode: string | undefined;
}

interface Page {
  pick: (name: string) => void;
  typeNumber: (value: string) => void;
  shown: () => Shown;
  submit: VoidFunction;
}

async function page(showCode: boolean): Promise<Page> {
  publishLibGroup("BrizyLibs", { ...window.BrizyLibs, SlimSelect });

  const { default: init } = await import(
    "visual/editorComponents/Form2/export"
  );
  const root = mount(
    form2({
      attributes: ACTION,
      fields: phoneField({
        label: "Phone",
        defaultCountry: "MD",
        showCode,
        countries: COUNTRIES
      })
    })
  );
  const form = query(root, "form");
  const input = queryInput(root, `input[name="Phone"]`);

  init(root);

  return {
    pick: (name) => {
      click(query(root, ".brz-forms2__phone--country-selected"));

      const option = queryAll(root, ".ss-option").find(
        (node) => node.textContent?.includes(name) ?? false
      );

      if (!option) {
        throw new Error(`no option ${name}`);
      }

      click(option);
    },
    typeNumber: (value) => type(input, value),
    shown: () => ({
      code:
        root.querySelector(".brz-forms2__phone--country-code")?.textContent ??
        undefined,
      flag:
        root.querySelector(".brz-forms2__phone--country-selected span")
          ?.className ?? undefined,
      dialCode: input.dataset.dialCode
    }),
    submit: () => {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  };
}

const submittedSchema = z.array(
  z.object({ name: z.string(), value: z.string() })
);

function submittedPhone(entries: Array<[string, string]>): string | undefined {
  const data = entries.find(([name]) => name === "data")?.[1] ?? "[]";

  return submittedSchema
    .parse(JSON.parse(data))
    .find(({ name }) => name === "Phone")?.value;
}

describe("the country code of a phone field", () => {
  it.each([
    {
      case: "shown",
      showCode: true,
      start: { code: "+373", flag: "fi fi-md", dialCode: "+373" },
      picked: { code: "+40", flag: "fi fi-ro", dialCode: "+40" }
    },
    {
      case: "hidden",
      showCode: false,
      start: { code: undefined, flag: "fi fi-md", dialCode: "+373" },
      picked: { code: undefined, flag: "fi fi-ro", dialCode: "+40" }
    }
  ])(
    "when $case, follows the picked country, is what is sent and goes back to the default after a send",
    async ({ showCode, start, picked }) => {
      const { pick, typeNumber, shown, submit } = await page(showCode);

      expect(shown()).toEqual(start);

      pick("Romania");

      expect(shown()).toEqual(picked);

      const transport = stubTransport({
        kind: "response",
        status: 200,
        contentType: "application/json",
        body: `{"success":true}`
      });

      typeNumber("721234567");
      submit();
      await settleTransport();
      transport.restore();

      const [request] = transport.requests;

      expect(
        submittedPhone(request.body.kind === "form" ? request.body.entries : [])
      ).toBe("+40721234567");
      expect(shown()).toEqual(start);
    }
  );
});
