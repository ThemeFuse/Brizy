import { getCalculatedValue, getValueInNullCase } from "../initCalculatedField";

describe("Testing form calculated field function", () => {
  test("Testing various scenarios", () => {
    // Case 1: Empty value, label, and formula
    expect(getCalculatedValue("", "", "", getValueInNullCase)).toBe("");

    // Case 2: Only formula provided
    expect(
      getCalculatedValue("", "Amount", "{{Count}}", getValueInNullCase)
    ).toBe("{{Count}}");

    // Case 3: Formula with multiple variables
    expect(
      getCalculatedValue("50", "", "{{Amount}} + {{Price}}", getValueInNullCase)
    ).toBe("{{Amount}} + {{Price}}");

    // Case 4: Value provided without formula
    expect(getCalculatedValue("50", "Test", "", getValueInNullCase)).toBe("");

    // Case 5: Single variable formula with value
    expect(
      getCalculatedValue("50", "Amount", "{{Count}}", getValueInNullCase)
    ).toBe("{{Count}}");

    // Case 6: Partially completed formula
    expect(
      getCalculatedValue(
        "234",
        "Amount",
        "{{Amount}} + {{Price}}",
        getValueInNullCase
      )
    ).toBe("234 + {{Price}}");

    // Case 7: Single variable formula, matched label
    expect(
      getCalculatedValue("100", "Test", "{{Test}}", getValueInNullCase)
    ).toBe("100");

    // Case 8: Formula with non-matching labels
    expect(
      getCalculatedValue("200", "Amount", "{{Price}}", getValueInNullCase)
    ).toBe("{{Price}}");

    // Case 9: Formula with mixed variables (valid + invalid)
    expect(
      getCalculatedValue(
        "500",
        "Total",
        "{{Amount}} + {{NonExistent}}",
        getValueInNullCase
      )
    ).toBe("{{Amount}} + {{NonExistent}}");

    // Case 10: Complex formula with multiple labels
    expect(
      getCalculatedValue(
        "300",
        "Amount",
        "{{Amount}} * 2 + {{Price}} - {{Discount}}",
        getValueInNullCase
      )
    ).toBe("300 * 2 + {{Price}} - {{Discount}}");
  });
});
