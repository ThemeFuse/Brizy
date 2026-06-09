import {
  applyRichTextUpdates,
  applyTypographyStyles,
  findAndReplaceInHtml,
  replaceAllTextInHtml,
  updateRichTextColor
} from "../richtext";

describe("RichText Utilities", () => {
  describe("findAndReplaceInHtml", () => {
    const testCases = [
      {
        name: "simple text replacement",
        html: "<p>Old text</p>",
        findText: "Old",
        replaceWith: "New",
        expected: "<p>New text</p>"
      },
      {
        name: "replace text in nested spans",
        html: "<p class='brz-tp-paragraph'><span class='brz-cp-color7'>Original text</span></p>",
        findText: "Original",
        replaceWith: "Updated",
        expected:
          '<p class="brz-tp-paragraph"><span class="brz-cp-color7">Updated text</span></p>'
      },
      {
        name: "replace across multiple paragraphs",
        html: "<p>First</p><p>Second</p>",
        findText: "First",
        replaceWith: "1st",
        expected: "<p>1st</p><p>Second</p>"
      },
      {
        name: "replace multiple occurrences",
        html: "<p>Hello Hello Hello</p>",
        findText: "Hello",
        replaceWith: "Hi",
        expected: "<p>Hi Hi Hi</p>"
      },
      {
        name: "preserve HTML structure and attributes",
        html: '<p class="my-class" data-id="123"><span style="color: red;">Old text here</span></p>',
        findText: "Old",
        replaceWith: "New",
        expected:
          '<p class="my-class" data-id="123"><span style="color: red;">New text here</span></p>'
      },
      {
        name: "handle special regex characters in search text",
        html: "<p>Price: $100.00 (USD)</p>",
        findText: "$100.00",
        replaceWith: "$200.00",
        expected: "<p>Price: $200.00 (USD)</p>"
      },
      {
        name: "handle text with brackets",
        html: "<p>Array[0] = value</p>",
        findText: "Array[0]",
        replaceWith: "List[0]",
        expected: "<p>List[0] = value</p>"
      },
      {
        name: "no match returns unchanged HTML",
        html: "<p>Original text</p>",
        findText: "NotFound",
        replaceWith: "Replacement",
        expected: "<p>Original text</p>"
      },
      {
        name: "replace in headings",
        html: "<h1>Main Title</h1><h2>Sub Title</h2>",
        findText: "Title",
        replaceWith: "Header",
        expected: "<h1>Main Header</h1><h2>Sub Header</h2>"
      },
      {
        name: "replace spaces",
        html: "<p>Hello World</p>",
        findText: " ",
        replaceWith: "-",
        expected: "<p>Hello-World</p>"
      }
    ];

    it.each(testCases)(
      "should handle $name",
      ({ html, findText, replaceWith, expected }) => {
        const result = findAndReplaceInHtml(html, findText, replaceWith);
        expect(result).toBe(expected);
      }
    );
  });

  describe("updateRichTextColor", () => {
    const testCases = [
      {
        name: "update color on existing single span",
        html: "<p><span class='brz-cp-color7'>Text</span></p>",
        colorHex: "#FF0000",
        opacity: 1,
        shouldContain: ["color: rgb(255, 0, 0)", "Text", "<span"],
        shouldNotContain: ["brz-cp-color7"]
      },
      {
        name: "preserve span structure and update color",
        html: "<p class='brz-tp-paragraph'><span class='brz-cp-color7 other-class'>Text</span></p>",
        colorHex: "#0000FF",
        opacity: 1,
        shouldContain: ["brz-tp-paragraph", "Text", "other-class", "<span"],
        shouldNotContain: ["brz-cp-color7"]
      },
      {
        name: "merge multiple spans into single colored span (mixed content)",
        html: "<p><span class='brz-cp-color7'>First</span><span class='brz-cp-color3'>Second</span></p>",
        colorHex: "#333333",
        opacity: 1,
        shouldContain: ["FirstSecond"],
        shouldNotContain: ["brz-cp-color7", "brz-cp-color3"]
      },
      {
        name: "preserve paragraph with multiple classes",
        html: "<p class='brz-tp-paragraph brz-tp-lg-paragraph'><span>Text</span></p>",
        colorHex: "#FFFFFF",
        opacity: 1,
        shouldContain: [
          "brz-tp-paragraph",
          "brz-tp-lg-paragraph",
          "Text",
          "<span"
        ],
        shouldNotContain: []
      },
      {
        name: "wrap text directly in p (no existing span)",
        html: '<p class="brz-tp-lg-paragraph" data-uniq-id="rV1QQ">The point of using dummy text.</p>',
        colorHex: "#0000FF",
        opacity: 1,
        shouldContain: [
          "The point of using dummy text.",
          'class="brz-tp-lg-paragraph"',
          'data-uniq-id="rV1QQ"'
        ],
        shouldNotContain: []
      },
      {
        name: "handle mixed content (text + span + text)",
        html: '<p class="brz-tp-lg-paragraph">Before <span style="color: red;">middle</span> after.</p>',
        colorHex: "#0000FF",
        opacity: 1,
        shouldContain: ["Before middle after.", "brz-tp-lg-paragraph"],
        shouldNotContain: ["color: red"]
      },
      {
        name: "handle h1 heading",
        html: '<h1 class="brz-tp-lg-heading1">Main Title</h1>',
        colorHex: "#FF0000",
        opacity: 1,
        shouldContain: ["<h1", "Main Title", "brz-tp-lg-heading1"],
        shouldNotContain: []
      },
      {
        name: "handle h2 heading with single span",
        html: '<h2 class="brz-tp-heading2"><span>Subtitle</span></h2>',
        colorHex: "#00FF00",
        opacity: 1,
        shouldContain: ["<h2", "Subtitle", "brz-tp-heading2", "<span"],
        shouldNotContain: []
      },
      {
        name: "handle mixed p and headings",
        html: "<h1>Title</h1><p>Paragraph text</p><h2>Subtitle</h2>",
        colorHex: "#0000FF",
        opacity: 1,
        shouldContain: [
          "<h1",
          "<p",
          "<h2",
          "Title",
          "Paragraph text",
          "Subtitle"
        ],
        shouldNotContain: []
      }
    ];

    it.each(testCases)(
      "should $name",
      ({ html, colorHex, opacity, shouldContain, shouldNotContain }) => {
        const result = updateRichTextColor(html, colorHex, opacity);

        shouldContain.forEach((str) => {
          expect(result).toContain(str);
        });

        shouldNotContain.forEach((str) => {
          expect(result).not.toContain(str);
        });
      }
    );
  });

  describe("applyRichTextUpdates", () => {
    const testCases = [
      {
        name: "find and replace specific text",
        html: "<p class='brz-tp-paragraph'><span class='brz-cp-color7'>Hello World</span></p>",
        params: { findText: "World", replaceWith: "Universe" },
        shouldContain: ["Hello Universe", "brz-cp-color7"],
        shouldNotContain: ["World"]
      },
      {
        name: "find and replace with color update",
        html: "<p class='brz-tp-paragraph'><span class='brz-cp-color7'>Old text here</span></p>",
        params: { findText: "Old", replaceWith: "New", colorHex: "#FF0000" },
        shouldContain: ["New text here", "color: rgb(255, 0, 0)"],
        shouldNotContain: ["Old", "brz-cp-color7"]
      },
      {
        name: "update only color when findText is not provided",
        html: "<p class='brz-tp-paragraph'><span class='brz-cp-color7'>Keep this</span></p>",
        params: { colorHex: "#FF0000" },
        shouldContain: ["Keep this", "color: rgb(255, 0, 0)"],
        shouldNotContain: ["brz-cp-color7"]
      },
      {
        name: "replace multiple occurrences",
        html: "<p>Buy now! Buy today!</p>",
        params: { findText: "Buy", replaceWith: "Shop" },
        shouldContain: ["Shop now! Shop today!"],
        shouldNotContain: ["Buy"]
      },
      {
        name: "handle special characters in findText",
        html: "<p>Price: $50.00</p>",
        params: { findText: "$50.00", replaceWith: "$75.00" },
        shouldContain: ["$75.00"],
        shouldNotContain: ["$50.00"]
      }
    ];

    it.each(testCases)(
      "should $name",
      ({ html, params, shouldContain, shouldNotContain }) => {
        const result = applyRichTextUpdates(html, params);

        shouldContain.forEach((str) => {
          expect(result).toContain(str);
        });

        shouldNotContain.forEach((str) => {
          expect(result).not.toContain(str);
        });
      }
    );

    it("should use provided colorOpacity", () => {
      const html = "<p><span>Text</span></p>";
      const result = applyRichTextUpdates(html, {
        colorHex: "#FF0000",
        colorOpacity: 0.8
      });
      expect(result).toMatch(/rgba\(.*,\s*0\.8\)/);
    });

    it("should return unchanged html when no params provided", () => {
      const html =
        "<p class='brz-tp-paragraph'><span class='brz-cp-color7'>Text</span></p>";
      const result = applyRichTextUpdates(html, {});
      expect(result).toBe(html);
    });

    it("should replace ALL text when only replaceWith is provided", () => {
      const html =
        "<p class='brz-tp-paragraph'><span class='brz-cp-color7'>Old content here</span></p>";
      const result = applyRichTextUpdates(html, {
        replaceWith: "Completely new text"
      });
      expect(result).toContain("Completely new text");
      expect(result).toContain("brz-tp-paragraph");
      expect(result).toContain("brz-cp-color7"); // span preserved (simple structure)
      expect(result).not.toContain("Old content");
    });

    it("should ignore findText without replaceWith", () => {
      const html = "<p>Original text</p>";
      const result = applyRichTextUpdates(html, { findText: "Original" });
      expect(result).toBe(html);
    });
  });

  describe("replaceAllTextInHtml", () => {
    const testCases = [
      {
        name: "replace all text in a single paragraph",
        html: "<p>Old text</p>",
        newText: "New text",
        expected: "<p>New text</p>"
      },
      {
        name: "replace text in first block and remove others",
        html: "<p>First paragraph</p><p>Second paragraph</p>",
        newText: "All new content",
        // Additional blocks are removed
        expected: "<p>All new content</p>"
      },
      {
        name: "preserve paragraph classes",
        html: '<p class="brz-tp-paragraph">Old text</p>',
        newText: "New text",
        expected: '<p class="brz-tp-paragraph">New text</p>'
      },
      {
        name: "preserve single span structure",
        html: "<p class='brz-tp-paragraph'><span class='brz-cp-color7'>Old content here</span></p>",
        newText: "New content here",
        expected:
          '<p class="brz-tp-paragraph"><span class="brz-cp-color7">New content here</span></p>'
      },
      {
        name: "replace mixed content without span",
        html: '<p class="brz-tp-lg-paragraph" data-uniq-id="fWN0N">Welcome to our <span style="color: red;" class="brz-cp-color4">solutions</span> and service.</p>',
        newText: "Completely new text here.",
        // Mixed content replaced with plain text (span added by color update if needed)
        expected:
          '<p class="brz-tp-lg-paragraph" data-uniq-id="fWN0N">Completely new text here.</p>'
      },
      {
        name: "preserve paragraph with data attributes",
        html: '<p class="brz-tp-lg-paragraph" data-uniq-id="fWN0N" data-generated-css="brz-css-oRvjC">Old text</p>',
        newText: "New text",
        expected:
          '<p class="brz-tp-lg-paragraph" data-uniq-id="fWN0N" data-generated-css="brz-css-oRvjC">New text</p>'
      },
      {
        name: "handle h1 heading",
        html: "<h1>Old title</h1>",
        newText: "New title",
        expected: "<h1>New title</h1>"
      },
      {
        name: "handle h2 heading with single span",
        html: '<h2 class="brz-tp-heading2"><span class="brz-cp-color7">Old subtitle</span></h2>',
        newText: "New subtitle",
        expected:
          '<h2 class="brz-tp-heading2"><span class="brz-cp-color7">New subtitle</span></h2>'
      },
      {
        name: "handle long replacement text with span",
        html: "<p class='brz-tp-paragraph'><span class='brz-cp-color7'>Short</span></p>",
        newText:
          "Discover our collection types, thoughtfully organized to help you easily find the resources.",
        expected:
          '<p class="brz-tp-paragraph"><span class="brz-cp-color7">Discover our collection types, thoughtfully organized to help you easily find the resources.</span></p>'
      },
      {
        name: "handle mixed headings and paragraphs - only keep first",
        html: "<h1>Title</h1><p>Content</p><h2>Subtitle</h2>",
        newText: "All replaced",
        // Only first block is kept, others are removed
        expected: "<h1>All replaced</h1>"
      }
    ];

    it.each(testCases)("should $name", ({ html, newText, expected }) => {
      const result = replaceAllTextInHtml(html, newText);
      expect(result).toBe(expected);
    });
  });

  describe("applyTypographyStyles", () => {
    const testCases = [
      {
        name: "apply fontSize via class",
        html: "<p>Text</p>",
        params: { fontSize: 24 },
        shouldContain: ["brz-fs-lg-24", "Text"]
      },
      {
        name: "apply fontWeight via class",
        html: "<p>Bold text</p>",
        params: { fontWeight: 700 },
        shouldContain: ["brz-fw-lg-700", "Bold text"]
      },
      {
        name: "apply lineHeight via class",
        html: "<p>Spaced text</p>",
        params: { lineHeight: 1.5 },
        shouldContain: ["brz-lh-lg-1_5", "Spaced text"]
      },
      {
        name: "apply textAlign center via class",
        html: "<p>Centered</p>",
        params: { textAlign: "center" as const },
        shouldContain: ["brz-text-lg-center", "Centered"]
      },
      {
        name: "apply multiple classes",
        html: "<p>Styled text</p>",
        params: { fontSize: 18, fontWeight: 600, lineHeight: 1.8 },
        shouldContain: ["brz-fs-lg-18", "brz-fw-lg-600", "brz-lh-lg-1_8"]
      },
      {
        name: "apply classes to heading",
        html: "<h1>Title</h1>",
        params: { fontSize: 32, fontWeight: 800 },
        shouldContain: ["<h1", "brz-fs-lg-32", "brz-fw-lg-800"]
      },
      {
        name: "return unchanged when no params",
        html: "<p>No change</p>",
        params: {},
        shouldContain: ["<p>No change</p>"]
      },
      {
        name: "preserve non-typography classes while adding new ones",
        html: '<p class="brz-bcp-color7 custom-class">Text</p>',
        params: { fontSize: 16 },
        shouldContain: ["brz-bcp-color7", "custom-class", "brz-fs-lg-16", "Text"]
      },
      {
        name: "replace existing typography class with new value",
        html: '<p class="brz-fs-lg-14">Text</p>',
        params: { fontSize: 20 },
        shouldContain: ["brz-fs-lg-20", "Text"],
        shouldNotContain: ["brz-fs-lg-14"]
      },
      {
        name: "apply all text alignment options",
        html: "<p>Right aligned</p>",
        params: { textAlign: "right" as const },
        shouldContain: ["brz-text-lg-right"]
      },
      {
        name: "handle lineHeight integer value",
        html: "<p>Text</p>",
        params: { lineHeight: 2 },
        shouldContain: ["brz-lh-lg-2"]
      },
      {
        name: "clear brz-tp-lg-paragraph preset and replace with empty",
        html: '<p class="brz-tp-lg-paragraph">Text</p>',
        params: { fontSize: 24 },
        shouldContain: ["brz-tp-lg-empty", "brz-fs-lg-24", "Text"],
        shouldNotContain: ["brz-tp-lg-paragraph"]
      },
      {
        name: "clear brz-tp-lg-heading1 preset and replace with empty",
        html: '<h1 class="brz-tp-lg-heading1">Title</h1>',
        params: { fontSize: 48, fontWeight: 700 },
        shouldContain: ["brz-tp-lg-empty", "brz-fs-lg-48", "brz-fw-lg-700"],
        shouldNotContain: ["brz-tp-lg-heading1"]
      },
      {
        name: "clear all responsive typography presets",
        html: '<p class="brz-tp-lg-paragraph brz-tp-sm-subtitle brz-tp-xs-abovetitle">Text</p>',
        params: { fontSize: 20 },
        shouldContain: [
          "brz-tp-lg-empty",
          "brz-tp-sm-empty",
          "brz-tp-xs-empty",
          "brz-fs-lg-20"
        ],
        shouldNotContain: [
          "brz-tp-lg-paragraph",
          "brz-tp-sm-subtitle",
          "brz-tp-xs-abovetitle"
        ]
      },
      {
        name: "clear legacy brz-tp preset",
        html: '<p class="brz-tp-paragraph">Text</p>',
        params: { fontSize: 18 },
        shouldContain: ["brz-tp-empty", "brz-fs-lg-18"],
        shouldNotContain: ["brz-tp-paragraph"]
      },
      {
        name: "keep brz-tp-lg-empty unchanged",
        html: '<p class="brz-tp-lg-empty brz-fs-lg-16">Text</p>',
        params: { fontSize: 20 },
        shouldContain: ["brz-tp-lg-empty", "brz-fs-lg-20"],
        shouldNotContain: ["brz-fs-lg-16"]
      },
      {
        name: "apply fontStyle paragraph preset",
        html: "<p>Text</p>",
        params: { fontStyle: "paragraph" as const },
        shouldContain: ["brz-tp-lg-paragraph"]
      },
      {
        name: "apply fontStyle heading1 preset",
        html: "<h1>Title</h1>",
        params: { fontStyle: "heading1" as const },
        shouldContain: ["brz-tp-lg-heading1"]
      },
      {
        name: "apply fontStyle heading2 preset",
        html: "<h2>Subtitle</h2>",
        params: { fontStyle: "heading2" as const },
        shouldContain: ["brz-tp-lg-heading2"]
      },
      {
        name: "replace existing preset with new fontStyle",
        html: '<p class="brz-tp-lg-paragraph">Text</p>',
        params: { fontStyle: "heading3" as const },
        shouldContain: ["brz-tp-lg-heading3"],
        shouldNotContain: ["brz-tp-lg-paragraph"]
      },
      {
        name: "apply fontStyle and custom fontSize together",
        html: "<p>Text</p>",
        params: { fontStyle: "heading1" as const, fontSize: 48 },
        shouldContain: ["brz-tp-lg-heading1", "brz-fs-lg-48"]
      },
      {
        name: "apply fontStyle with multiple custom overrides",
        html: "<p>Text</p>",
        params: {
          fontStyle: "paragraph" as const,
          fontSize: 18,
          fontWeight: 600,
          lineHeight: 1.8
        },
        shouldContain: [
          "brz-tp-lg-paragraph",
          "brz-fs-lg-18",
          "brz-fw-lg-600",
          "brz-lh-lg-1_8"
        ]
      },
      {
        name: "apply fontStyle subtitle preset",
        html: "<p>Subtitle text</p>",
        params: { fontStyle: "subtitle" as const },
        shouldContain: ["brz-tp-lg-subtitle"]
      },
      {
        name: "apply fontStyle abovetitle preset",
        html: "<p>Above title</p>",
        params: { fontStyle: "abovetitle" as const },
        shouldContain: ["brz-tp-lg-abovetitle"]
      },
      {
        name: "apply fontStyle button preset",
        html: "<p>Button text</p>",
        params: { fontStyle: "button" as const },
        shouldContain: ["brz-tp-lg-button"]
      },
      {
        name: "clear fontStyle with empty string - removes preset",
        html: '<p class="brz-tp-lg-paragraph">Text</p>',
        params: { fontStyle: "" as const },
        shouldContain: ["brz-tp-lg-empty", "Text"],
        shouldNotContain: ["brz-tp-lg-paragraph"]
      },
      {
        name: "clear fontStyle with empty string - no invalid class added",
        html: '<p class="brz-tp-lg-heading1">Title</p>',
        params: { fontStyle: "" as const },
        shouldContain: ["brz-tp-lg-empty"],
        shouldNotContain: ["brz-tp-lg-heading1", "brz-tp-lg-\"\""]
      },
      {
        name: "clear fontStyle with empty string clears all responsive presets",
        html: '<p class="brz-tp-lg-paragraph brz-tp-sm-subtitle brz-tp-xs-abovetitle">Text</p>',
        params: { fontStyle: "" as const },
        shouldContain: [
          "brz-tp-lg-empty",
          "brz-tp-sm-empty",
          "brz-tp-xs-empty"
        ],
        shouldNotContain: [
          "brz-tp-lg-paragraph",
          "brz-tp-sm-subtitle",
          "brz-tp-xs-abovetitle"
        ]
      },
      {
        name: "clear fontStyle with empty string and apply custom fontSize",
        html: '<p class="brz-tp-lg-heading2">Text</p>',
        params: { fontStyle: "" as const, fontSize: 24 },
        shouldContain: ["brz-tp-lg-empty", "brz-fs-lg-24"],
        shouldNotContain: ["brz-tp-lg-heading2"]
      },
      {
        name: "clear fontStyle with empty string and apply multiple custom values",
        html: '<p class="brz-tp-lg-paragraph">Text</p>',
        params: {
          fontStyle: "" as const,
          fontSize: 18,
          fontWeight: 600,
          lineHeight: 1.8
        },
        shouldContain: [
          "brz-tp-lg-empty",
          "brz-fs-lg-18",
          "brz-fw-lg-600",
          "brz-lh-lg-1_8"
        ],
        shouldNotContain: ["brz-tp-lg-paragraph"]
      }
    ];

    it.each(testCases)(
      "should $name",
      ({ html, params, shouldContain, shouldNotContain }) => {
        const result = applyTypographyStyles(html, params);

        shouldContain.forEach((str) => {
          expect(result).toContain(str);
        });

        if (shouldNotContain) {
          shouldNotContain.forEach((str) => {
            expect(result).not.toContain(str);
          });
        }
      }
    );
  });

  describe("applyRichTextUpdates with typography", () => {
    const testCases = [
      {
        name: "apply text replacement with fontSize class",
        html: "<p><span>Old text</span></p>",
        params: { replaceWith: "New text", fontSize: 20 },
        shouldContain: ["New text", "brz-fs-lg-20"]
      },
      {
        name: "apply color and typography classes together",
        html: "<p><span>Text</span></p>",
        params: { colorHex: "#FF0000", fontSize: 16, fontWeight: 500 },
        shouldContain: ["color:", "brz-fs-lg-16", "brz-fw-lg-500"]
      },
      {
        name: "apply only typography classes without text change",
        html: "<p>Keep this text</p>",
        params: { fontSize: 14, textAlign: "center" as const },
        shouldContain: ["Keep this text", "brz-fs-lg-14", "brz-text-lg-center"]
      },
      {
        name: "apply lineHeight class with decimal value",
        html: "<p>Text</p>",
        params: { lineHeight: 1.3 },
        shouldContain: ["brz-lh-lg-1_3"]
      },
      {
        name: "combine find/replace with typography classes",
        html: "<p>Hello World</p>",
        params: {
          findText: "World",
          replaceWith: "Universe",
          fontSize: 18,
          fontWeight: 700
        },
        shouldContain: ["Hello Universe", "brz-fs-lg-18", "brz-fw-lg-700"]
      },
      {
        name: "apply fontStyle preset with text replacement",
        html: "<p><span>Old text</span></p>",
        params: { replaceWith: "New text", fontStyle: "heading1" as const },
        shouldContain: ["New text", "brz-tp-lg-heading1"]
      },
      {
        name: "apply fontStyle with color",
        html: "<p><span>Text</span></p>",
        params: { fontStyle: "paragraph" as const, colorHex: "#FF0000" },
        shouldContain: ["brz-tp-lg-paragraph", "color:"]
      },
      {
        name: "wrap plain text in <p> and apply textAlign",
        html: "Moved Text",
        params: { textAlign: "center" as const },
        shouldContain: [
          "<p",
          "brz-text-lg-center",
          "brz-tp-paragraph",
          "Moved Text"
        ]
      },
      {
        name: "wrap plain text in <p> and apply color",
        html: "Plain text",
        params: { colorHex: "#FF0000" },
        shouldContain: ["<p", "brz-tp-paragraph", "color:", "Plain text"]
      },
      {
        name: "wrap plain text in <p> and apply fontSize",
        html: "No tags",
        params: { fontSize: 20 },
        shouldContain: ["<p", "brz-fs-lg-20", "No tags"]
      },
      {
        name: "clear fontStyle with empty string via applyRichTextUpdates",
        html: '<p class="brz-tp-lg-paragraph"><span>Text</span></p>',
        params: { fontStyle: "" as const },
        shouldContain: ["brz-tp-lg-empty", "Text"],
        shouldNotContain: ["brz-tp-lg-paragraph"]
      },
      {
        name: "clear fontStyle and replace text simultaneously",
        html: '<p class="brz-tp-lg-heading1"><span>Old title</span></p>',
        params: { fontStyle: "" as const, replaceWith: "New title" },
        shouldContain: ["brz-tp-lg-empty", "New title"],
        shouldNotContain: ["brz-tp-lg-heading1", "Old title"]
      },
      {
        name: "clear fontStyle with color and custom fontSize",
        html: '<p class="brz-tp-lg-paragraph"><span>Text</span></p>',
        params: {
          fontStyle: "" as const,
          colorHex: "#FF0000",
          fontSize: 20
        },
        shouldContain: ["brz-tp-lg-empty", "brz-fs-lg-20", "color:"]
      },
      {
        name: "clear preset, add font classes and default typography when fontFamily is provided",
        html: '<p class="brz-tp-paragraph"><span class="brz-cp-color7">Text content</span></p>',
        params: { fontFamily: "open_sans" },
        shouldContain: [
          "Text content",
          "brz-tp-empty",
          "brz-cp-color7",
          "brz-ff-open_sans",
          "brz-ft-google",
          "brz-fs-lg-16",
          "brz-fw-lg-400",
          "brz-lh-lg-1_3"
        ],
        shouldNotContain: ["brz-tp-paragraph"]
      },
      {
        name: "clear responsive preset and add font classes when fontFamily is provided",
        html: '<p class="brz-tp-lg-heading1"><span>Title</span></p>',
        params: { fontFamily: "playfair_display", fontFamilyType: "google" },
        shouldContain: [
          "Title",
          "brz-tp-lg-empty",
          "brz-ff-playfair_display",
          "brz-ft-google",
          "brz-fs-lg-16",
          "brz-fw-lg-400",
          "brz-lh-lg-1_3"
        ],
        shouldNotContain: ["brz-tp-lg-heading1"]
      },
      {
        name: "clear all responsive presets when fontFamily is provided",
        html: '<p class="brz-tp-lg-paragraph brz-tp-sm-paragraph brz-tp-xs-paragraph"><span>Text</span></p>',
        params: { fontFamily: "montserrat" },
        shouldContain: [
          "brz-tp-lg-empty",
          "brz-tp-sm-empty",
          "brz-tp-xs-empty",
          "brz-ff-montserrat",
          "Text"
        ],
        shouldNotContain: [
          "brz-tp-lg-paragraph",
          "brz-tp-sm-paragraph",
          "brz-tp-xs-paragraph"
        ]
      },
      {
        name: "set fontFamilyType to upload when specified",
        html: '<p class="brz-tp-lg-paragraph"><span>Text</span></p>',
        params: { fontFamily: "my_custom_font", fontFamilyType: "upload" },
        shouldContain: ["brz-ff-my_custom_font", "brz-ft-upload"],
        shouldNotContain: ["brz-ft-google"]
      },
      {
        name: "preserve existing fontSize when fontFamily is set without explicit fontSize",
        html: '<p class="brz-tp-lg-empty brz-fs-lg-24 brz-fw-lg-700 brz-lh-lg-1_5"><span>Text</span></p>',
        params: { fontFamily: "roboto" },
        shouldContain: [
          "brz-ff-roboto",
          "brz-fs-lg-24",
          "brz-fw-lg-700",
          "brz-lh-lg-1_5"
        ],
        shouldNotContain: ["brz-fs-lg-16", "brz-fw-lg-400", "brz-lh-lg-1_3"]
      },
      {
        name: "override existing fontSize when fontFamily and explicit fontSize are provided",
        html: '<p class="brz-tp-lg-empty brz-fs-lg-24"><span>Text</span></p>',
        params: { fontFamily: "roboto", fontSize: 32 },
        shouldContain: ["brz-ff-roboto", "brz-fs-lg-32"],
        shouldNotContain: ["brz-fs-lg-24"]
      },
      {
        name: "clear preset and apply text replacement with fontFamily",
        html: '<p class="brz-tp-lg-paragraph"><span>Old text</span></p>',
        params: {
          findText: "Old",
          replaceWith: "New",
          fontFamily: "allura",
          fontFamilyType: "google"
        },
        shouldContain: ["New text", "brz-tp-lg-empty", "brz-ff-allura"],
        shouldNotContain: ["Old text", "brz-tp-lg-paragraph"]
      },
      {
        name: "clear preset and apply color with fontFamily",
        html: '<p class="brz-tp-lg-heading2"><span>Colored text</span></p>',
        params: {
          colorHex: "#FF0000",
          fontFamily: "montserrat",
          fontFamilyType: "google"
        },
        shouldContain: [
          "color: rgb(255, 0, 0)",
          "Colored text",
          "brz-tp-lg-empty",
          "brz-ff-montserrat"
        ],
        shouldNotContain: ["brz-tp-lg-heading2"]
      },
      {
        name: "clear preset and apply explicit fontSize with fontFamily",
        html: '<p class="brz-tp-lg-paragraph">Styled text</p>',
        params: {
          fontSize: 24,
          fontWeight: 700,
          fontFamily: "roboto",
          fontFamilyType: "google"
        },
        shouldContain: [
          "brz-fs-lg-24",
          "brz-fw-lg-700",
          "brz-tp-lg-empty",
          "brz-ff-roboto",
          "Styled text"
        ],
        shouldNotContain: ["brz-tp-lg-paragraph"]
      },
      {
        name: "combine all operations with fontFamily",
        html: '<p class="brz-tp-lg-paragraph"><span class="brz-cp-color7">Hello World</span></p>',
        params: {
          findText: "World",
          replaceWith: "Universe",
          colorHex: "#0000FF",
          fontSize: 18,
          fontFamily: "open_sans",
          fontFamilyType: "google"
        },
        shouldContain: [
          "Hello Universe",
          "brz-fs-lg-18",
          "brz-tp-lg-empty",
          "brz-ff-open_sans",
          "color:"
        ],
        shouldNotContain: ["World", "brz-tp-lg-paragraph"]
      }
    ];

    it.each(testCases)(
      "should $name",
      ({ html, params, shouldContain, shouldNotContain }) => {
        const result = applyRichTextUpdates(html, params);

        shouldContain.forEach((str) => {
          expect(result).toContain(str);
        });

        if (shouldNotContain) {
          shouldNotContain.forEach((str) => {
            expect(result).not.toContain(str);
          });
        }
      }
    );
  });
});
