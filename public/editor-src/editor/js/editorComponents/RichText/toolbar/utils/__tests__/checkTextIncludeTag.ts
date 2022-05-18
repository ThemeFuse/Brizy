import { checkTextIncludeTag } from "../checkTextIncludeTag";

//  string contains HTML tag

const text1 = `
<div>
    <h1 class="test_class">
        <p>Paragraph text</p>
        <h2>Heading 2 test</h2>
    <h1/>
    <h6>
        h6 message
    </h6>
    <button>
        <h5>Button Heading 5 text</h5>
    </button>
</div>
`;

test("Test 'checkTextIncludeTag' function", () => {
  expect(checkTextIncludeTag(text1, "h1")).toBe(true);
  expect(checkTextIncludeTag(text1, "h2")).toBe(true);
  expect(checkTextIncludeTag(text1, "h3")).toBe(false);
  expect(checkTextIncludeTag(text1, "h4")).toBe(false);
  expect(checkTextIncludeTag(text1, "h5")).toBe(true);
  expect(checkTextIncludeTag(text1, "h6")).toBe(true);
});

const text2 = `
<H1>
    <p>text</p>
    <h2>text 2</h3>
    <H5 class="h5class">h5 text</h5>
</H1>
another text
`;

test("Test 'checkTextIncludeTag' function", () => {
  expect(checkTextIncludeTag(text2, "h1")).toBe(true);
  expect(checkTextIncludeTag(text2, "h2")).toBe(true);
  expect(checkTextIncludeTag(text2, "h3")).toBe(false);
  expect(checkTextIncludeTag(text2, "h4")).toBe(false);
  expect(checkTextIncludeTag(text2, "h5")).toBe(true);
  expect(checkTextIncludeTag(text2, "h6")).toBe(false);
  expect(checkTextIncludeTag(text2, "p")).toBe(true);
});

const text3 = `
<h1 data-uniq-id="pbejw" data-generated-css="brz-css-syfwn" class="brz-css-iiekj"><span class="brz-cp-color2">Understand the customer story.</span></h1>
<h3 class="brz-css-scjul" data-uniq-id="lnidk" data-generated-css="brz-css-fkvfp"><span class="brz-cp-color7">In order to succeed, your desire for success should be greater than your fear of failure.</span></h3>
<H2 class="brz-css-zfpeh" data-uniq-id="jonvx" data-generated-css="brz-css-jagzz"><span class="brz-cp-color7" style="opacity: 0.75;">&#x201C;Conversion rates have been going up 12% since we moved our entire platform to these guys! Definately recommended&#x201D;</span></h2>
<P class="brz-css-rklry" data-generated-css="brz-css-xpacl" data-uniq-id="rpyog"><span class="brz-cp-color7" style="opacity: 0.75;">&#x201C;Conversion rates have been going up 12% since we moved our entire platform to these guys! Definately recommended&#x201D;</span></p>
<h4 class="brz-css-mprgn" data-uniq-id="khkhv" data-generated-css="brz-css-twkef"><span class="brz-cp-color2">Joelle Doe, CMO @ FrontLines</span></h4>
<H5 class="brz-css-cehsn" data-generated-css="brz-css-klwzo" data-uniq-id="xaymn"><span class="brz-cp-color2">Understand the customer story.</span></h5>
<h6 class="brz-css-wnyhk" data-uniq-id="rlprz" data-generated-css="brz-css-wiusw"><span class="brz-cp-color2">Understand the customer story.</span></h6>
`;

test("Test 'checkTextIncludeTag' function", () => {
  expect(checkTextIncludeTag(text3, "h1")).toBe(true);
  expect(checkTextIncludeTag(text3, "h2")).toBe(true);
  expect(checkTextIncludeTag(text3, "h3")).toBe(true);
  expect(checkTextIncludeTag(text3, "h4")).toBe(true);
  expect(checkTextIncludeTag(text3, "h5")).toBe(true);
  expect(checkTextIncludeTag(text3, "h6")).toBe(true);
  expect(checkTextIncludeTag(text3, "p")).toBe(true);
});
