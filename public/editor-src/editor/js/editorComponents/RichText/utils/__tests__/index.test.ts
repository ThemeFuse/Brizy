import { ElementModelType2 } from "visual/component/Elements/Types";
import { encodeToString } from "visual/utils/string";
import { getFilteredPopups } from "..";

describe("Testing getFilteredPopups", () => {
  const popups = [
    {
      value: {
        popupId: "1",
        name: "popup1"
      }
    },
    {
      value: {
        popupId: "2",
        name: "popup2"
      }
    },
    {
      value: {
        popupId: "3",
        name: "popup4"
      }
    }
  ] as unknown as Array<ElementModelType2>;

  it("should return empty array for empty string", () => {
    const filteredPopups = getFilteredPopups("", popups);
    expect(filteredPopups).toEqual([]);
  });

  it("should return empty array for text without data-href attribute ", () => {
    const textContent = `<p class="brz-tp-lg-paragraph"><span class="brz-cp-color7">The point of using dummy text for your paragraph is that it has a more-or-less distribution of letters.</p>`;
    const filteredPopups = getFilteredPopups(textContent, popups);
    expect(filteredPopups).toEqual([]);
  });

  it("should return empty array for text with data-href attribute but without popup type", () => {
    const textContent = `<p class="brz-tp-lg-paragraph"><a data-href="popup1" class="brz-cp-color7 link--popup is-empty">point</a></p>`;
    const filteredPopups = getFilteredPopups(textContent, popups);
    expect(filteredPopups).toEqual([]);
  });

  it("should return only the first popup", () => {
    const data = encodeToString({
      type: "popup",
      popup: "#1"
    });

    const textContent = `<p class="brz-tp-lg-paragraph" data-uniq-id="cpui1" data-generated-css="brz-css-fkqcV"><span class="brz-cp-color7">The </span><a data-href="${data}" class="brz-cp-color7 link--popup is-empty">point</a><span class="brz-cp-color7"></span></p>`;
    const filteredPopups = getFilteredPopups(textContent, popups);
    expect(filteredPopups).toEqual([popups[0]]);
  });

  it("should return all popups", () => {
    const data1 = encodeToString({
      type: "popup",
      popup: "#1"
    });
    const data2 = encodeToString({
      type: "popup",
      popup: "#2"
    });
    const data3 = encodeToString({
      type: "popup",
      popup: "#3"
    });

    const textContent = `<p class="brz-tp-lg-paragraph" data-uniq-id="cpui1" data-generated-css="brz-css-fkqcV">
    <span class="brz-cp-color7">The </span><a data-href="${data1}" class="brz-cp-color7 link--popup is-empty">point</a>
    <span class="brz-cp-color7"><a data-href="${data2}">second</a></span>
    <span class="brz-cp-color7"><a data-href="${data3}">third</a></span>
    </p>`;

    const filteredPopups = getFilteredPopups(textContent, popups);
    expect(filteredPopups).toEqual(popups);
  });
});
