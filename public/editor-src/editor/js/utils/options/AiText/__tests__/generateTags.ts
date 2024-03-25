import { generateTags } from "../utils";

describe("generateTags function", () => {
  test.each([
    [
      "should correct extract tags until plain text faced",
      `<p class="brz-text-xs-center brz-text-sm-center brz-mb-lg-5 brz-mt-lg-5 brz-tp-lg-paragraph brz-text-lg-left" data-uniq-id="j2Jw_" data-generated-css="brz-css-bJohE">ir möchte<span style="opacity: 1; color: rgb(168, 44, 229);"><b>Wir möchten uns bei Ihnen für die Unannehmlichkeiten entschuldigen, die durch unsere derzeitigen Wartungs- und Reinigungsarbeiten entstehen. Unser Team arbeitet hart daran, sicherzustellen, dass Ihre Erfahrung so optimal wie möglich ist. Wir bitten Sie um etwas mehr Geduld, während wir diese Aufgaben abschließen. Bitte seien Sie versichert, dass wir unser Bestes tun, um die Unterbrechung Ihres Browsing-Erlebnisses so gering wie möglich zu halten. Unsere Techniker arbeiten rund um die Uhr, um eventuelle Probleme <b>zu beheben und sicherzustellen, dass unsere Plattform einwandfrei funktioniert. Vielen Dank für Ihre Geduld und Ihr Verständnis. Ihre Treue ist uns sehr wichtig und wir tun alles, um schnellstmöglich wieder für Sie da zu sein. In der Zwischenzeit laden wir Sie ein, unsere Website zu erkunden und uns auf den sozialen Medien zu folgen, um auf dem Laufenden zu bleiben. Vielen Dank für Ihre Unterstützung und wir freuen uns darauf, Sie bald wieder bedienen zu dürfen.</span></p>`,
      {
        openingTags: `<p class="brz-text-xs-center brz-text-sm-center brz-mb-lg-5 brz-mt-lg-5 brz-tp-lg-paragraph brz-text-lg-left" data-uniq-id="j2Jw_" data-generated-css="brz-css-bJohE">`,
        closingTags: `</p>`
      }
    ],
    [
      "should correct extract tags until plain text faced",
      `<p class="brz-text-sm-center brz-tp-lg-heading2 brz-text-lg-left brz-text-xs-center" data-generated-css="brz-css-uWKlW" data-uniq-id="trFGv"><em><s><u>Sit</u></s></em><em style="color: rgb(177, 38, 38); opacity: 1;"><s><u>e und</u></s></em><em><s><u>er maintenance</u></s></em></p>`,
      {
        openingTags: `<p class="brz-text-sm-center brz-tp-lg-heading2 brz-text-lg-left brz-text-xs-center" data-generated-css="brz-css-uWKlW" data-uniq-id="trFGv"><em><s><u>`,
        closingTags: `</u></s></em></p>`
      }
    ],
    [
      "should correct extract tags when opening and closing tags are present",
      `<p class="brz-text-sm-center brz-tp-lg-heading2 brz-text-lg-left brz-text-xs-center" data-generated-css="brz-css-uWKlW" data-uniq-id="trFGv">Site under maintenance</em></p>`,
      {
        openingTags: `<p class="brz-text-sm-center brz-tp-lg-heading2 brz-text-lg-left brz-text-xs-center" data-generated-css="brz-css-uWKlW" data-uniq-id="trFGv">`,
        closingTags: `</p>`
      }
    ],
    [
      "should correct extract tags when opening and closing tags are present",
      `<p class="brz-text-sm-center brz-tp-lg-heading2 brz-text-lg-left brz-text-xs-center" data-generated-css="brz-css-uWKlW" data-uniq-id="trFGv">Site under maintenance<em></p>`,
      {
        openingTags: `<p class="brz-text-sm-center brz-tp-lg-heading2 brz-text-lg-left brz-text-xs-center" data-generated-css="brz-css-uWKlW" data-uniq-id="trFGv">`,
        closingTags: `</p>`
      }
    ],
    [
      "should return empty object if no opening and closing tags present before plain text",
      `Site under maintenance<p></p>`,
      {
        openingTags: ``,
        closingTags: ``
      }
    ],
    [
      "should return empty closing and opening tags if empty string was provided",
      "",
      {
        openingTags: ``,
        closingTags: ``
      }
    ],
    [
      "should avoid tags with numbers in tag name",
      "<p> <333>3</333> </p>",
      {
        openingTags: `<p>`,
        closingTags: `</p>`
      }
    ],
    [
      "should extract custom tags",
      `<custom-tag class="brz" data-generated-css="brz-css" data-uniq-id="trFGv"><p attr-x="3">Site un</p>der maintenance</em></custom-tag>`,
      {
        openingTags: `<custom-tag class="brz" data-generated-css="brz-css" data-uniq-id="trFGv"><p attr-x="3">`,
        closingTags: `</p></custom-tag>`
      }
    ],
    [
      "should avoid tags without text content",
      `<p class="dsa"></p><x class="x"></x><y>3</y>`,
      {
        openingTags: `<y>`,
        closingTags: `</y>`
      }
    ],
    [
      "should avoid tags without text content",
      `<p class="dsa"></p><custom-tag class="brz" zxc data-qwe=[333] data-generated-css="brz-css" data-uniq-id="trFGv"><x></x><hello attr-x="3">S<x class="3">i</x id="2">te un</hello zxc data-qwe=[333]>der maintenance</em></custom-tag>`,
      {
        openingTags: `<custom-tag class="brz" zxc data-qwe=[333] data-generated-css="brz-css" data-uniq-id="trFGv"><hello attr-x="3">`,
        closingTags: `</hello></custom-tag>`
      }
    ],
    [
      "should return empty opening and closing tags if they not present in input",
      `input without tags`,
      {
        openingTags: ``,
        closingTags: ``
      }
    ],
    [
      "should return all custom tags and HTML tags until plain text faced",
      `<tag1 class="1"><p class="2"><x-x-x class="3">Hello, World<anotherTag></anotherTag></x-x-x></p></tag1>`,
      {
        openingTags: `<tag1 class="1"><p class="2"><x-x-x class="3">`,
        closingTags: `</x-x-x></p></tag1>`
      }
    ]
  ])("%s", (_testName, inputString, expectedResult) => {
    const result = generateTags(inputString);
    expect(result).toStrictEqual(expectedResult);
  });
});
