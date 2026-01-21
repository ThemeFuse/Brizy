import { ElementModel } from "visual/component/Elements/Types";
import { makePlaceholder } from "visual/utils/dynamicContent";
import { m2 } from "../version2";

describe("Testing RichText migration", () => {
  test.each<[ElementModel, ElementModel]>([
    [{}, {}],

    [{ color: "111" }, { color: "111" }],

    [
      { text: "<p class='brz-tp-paragraph'>Text1</p>" },
      { text: "<p class='brz-tp-paragraph'>Text1</p>" }
    ],

    [
      { text: "<p class='brz-tp-paragraph' data-population=''>Text1</p>" },
      { text: "<p class='brz-tp-paragraph' data-population=''>Text1</p>" }
    ],
    [
      { text: "<p class='brz-tp-paragraph' data-population='    '>Text1</p>" },
      { text: "<p class='brz-tp-paragraph' data-population='    '>Text1</p>" }
    ],

    [
      {
        text: "<p class='brz-tp-paragraph' data-population='{{asdasdasdasd'>Text1</p>"
      },
      {
        text: `<p class='brz-tp-paragraph' data-population="${makePlaceholder({
          content: "{{{{asdasdasdasd}}"
        })}">Text1</p>`
      }
    ],

    [
      {
        text: "<p class='brz-tp-paragraph' data-population='[asdasdasdasd]'>Text1</p>"
      },
      {
        text: `<p class='brz-tp-paragraph' data-population="${makePlaceholder({
          content: "{{[asdasdasdasd]}}"
        })}">Text1</p>`
      }
    ],

    [
      {
        text: "<p class='brz-tp-paragraph' data-population='{asdasdasdasd}'>Text1</p>"
      },
      {
        text: `<p class='brz-tp-paragraph' data-population="${makePlaceholder({
          content: "{{{asdasdasdasd}}}"
        })}">Text1</p>`
      }
    ],

    [
      {
        test: "11",
        text: "<p class='brz-tp-paragraph'><span class='brz-cp-color7' data-population='brizy_dc_post_excerpt'>Text 3</span></p>"
      },
      {
        test: "11",
        text: `<p class='brz-tp-paragraph'><span class='brz-cp-color7' data-population="${makePlaceholder(
          { content: "{{brizy_dc_post_excerpt}}" }
        )}">Text 3</span></p>`
      }
    ],

    [
      {
        text: `<p class="brz-tp-lg-paragraph">Page Title</p>
<div class="brz-tp__dc-block brz-tp__dc-block-st1 brz-tp-lg-paragraph">
<span class="text-population" data-population="brizy_dc_post_title">#Page Title</span> </div>
<div class="brz-tp__dc-block">Description</div>
<span class="text-population" data-population="brizy_dc_collection_item_field">#Description</span> </div>
<div class="brz-tp__dc-block" >Publish Date</div>
<span class="text-population" data-population="brizy_dc_post_created_at">#Publish date</span>
<span class="text-population" data-population="{brizy_dc_post_created_at}}">#Publish date 111</span></div>`
      },
      {
        text: `<p class="brz-tp-lg-paragraph">Page Title</p>
<div class="brz-tp__dc-block brz-tp__dc-block-st1 brz-tp-lg-paragraph">
<span class="text-population" data-population="${makePlaceholder({
          content: "{{brizy_dc_post_title}}"
        })}">#Page Title</span> </div>
<div class="brz-tp__dc-block">Description</div>
<span class="text-population" data-population="${makePlaceholder({
          content: "{{brizy_dc_collection_item_field}}"
        })}">#Description</span> </div>
<div class="brz-tp__dc-block" >Publish Date</div>
<span class="text-population" data-population="${makePlaceholder({
          content: "{{brizy_dc_post_created_at}}"
        })}">#Publish date</span>
<span class="text-population" data-population="${makePlaceholder({
          content: "{{{brizy_dc_post_created_at}}}}"
        })}">#Publish date 111</span></div>`
      }
    ],

    [
      {
        text: "<p class='brz-tp-paragraph'><span class='brz-cp-color7' data-population=\"{{UserAttribute['publisher_name']|default('abc')}}\">Text 3</span></p>"
      },
      {
        text: `<p class='brz-tp-paragraph'><span class='brz-cp-color7' data-population="${makePlaceholder(
          { content: "{{UserAttribute['publisher_name']|default('abc')}}" }
        )}">Text 3</span></p>`
      }
    ],

    // Image Population
    [
      {
        text: "<p><span data-image_population=\"{{brizy_dc_collection_item_field size='original' slug='image'}}\"></span>asdasda sda sdas dasd asd</p>"
      },
      {
        text: `<p><span data-image_population="${makePlaceholder({
          content:
            "{{brizy_dc_collection_item_field size='original' slug='image'}}"
        })}"></span>asdasda sda sdas dasd asd</p>`
      }
    ],

    // Image Population
    [
      {
        text: '<p><span data-image_population="{{brizy_dc_collection_item_field}}">111</span></p>'
      },
      {
        text: `<p><span data-image_population="${makePlaceholder({
          content: "{{brizy_dc_collection_item_field}}"
        })}">111</span></p>`
      }
    ],

    [
      {
        text: `<p class="brz-tp-lg-paragraph">Page Title</p>
<div class="brz-tp__dc-block brz-tp__dc-block-st1 brz-tp-lg-paragraph">
<span class="text-population" data-image_population="{{brizy_dc_collection_item_field}}">#Page Title</span> </div>
<div class="brz-tp__dc-block">Description</div>
<span class="text-population" data-image_population="{{brizy_dc_collection_item_field}}">#Description</span> </div>
<div class="brz-tp__dc-block" >Publish Date</div>
<span class="text-population" data-image_population="{{brizy_dc_collection_item_field size='custom'}}">#Publish date</span>
<span class="text-population" data-image_population="{brizy_dc_collection_item_field size='custom}">#Publish date 111</span></div>`
      },
      {
        text: `<p class="brz-tp-lg-paragraph">Page Title</p>
<div class="brz-tp__dc-block brz-tp__dc-block-st1 brz-tp-lg-paragraph">
<span class="text-population" data-image_population="${makePlaceholder({
          content: "{{brizy_dc_collection_item_field}}"
        })}">#Page Title</span> </div>
<div class="brz-tp__dc-block">Description</div>
<span class="text-population" data-image_population="${makePlaceholder({
          content: "{{brizy_dc_collection_item_field}}"
        })}">#Description</span> </div>
<div class="brz-tp__dc-block" >Publish Date</div>
<span class="text-population" data-image_population="${makePlaceholder({
          content: "{{brizy_dc_collection_item_field size='custom'}}"
        })}">#Publish date</span>
<span class="text-population" data-image_population="${makePlaceholder({
          content: "{brizy_dc_collection_item_field size='custom}"
        })}">#Publish date 111</span></div>`
      }
    ],

    // Both
    [
      {
        text: `<p class="brz-tp-lg-paragraph">Page Title</p>
<div class="brz-tp__dc-block brz-tp__dc-block-st1 brz-tp-lg-paragraph">
<span class="text-population" data-population="brizy_dc_collection_item_field" data-image_population="{{brizy_dc_collection_item_field}}">#Page Title</span> </div>
<div class="brz-tp__dc-block">Description</div>
<span class="text-population" data-image_population="{{brizy_dc_collection_item_field}}" data-population="brizy_dc_collection_item_field">#Description</span> </div>
<div class="brz-tp__dc-block" >Publish Date</div>
<span data-image_population="{brizy_dc_collection_item_field size='custom}" class="text-population" data-population="{{brizy_dc_collection_item_field size='custom'}}">#Publish date</span>
<span class="text-population" data-image_population="{brizy_dc_collection_item_field size='custom}">#Publish date 111</span></div>`
      },
      {
        text: `<p class="brz-tp-lg-paragraph">Page Title</p>
<div class="brz-tp__dc-block brz-tp__dc-block-st1 brz-tp-lg-paragraph">
<span class="text-population" data-population="${makePlaceholder({
          content: "{{brizy_dc_collection_item_field}}"
        })}" data-image_population="${makePlaceholder({
          content: "{{brizy_dc_collection_item_field}}"
        })}">#Page Title</span> </div>
<div class="brz-tp__dc-block">Description</div>
<span class="text-population" data-image_population="${makePlaceholder({
          content: "{{brizy_dc_collection_item_field}}"
        })}" data-population="${makePlaceholder({
          content: "{{brizy_dc_collection_item_field}}"
        })}">#Description</span> </div>
<div class="brz-tp__dc-block" >Publish Date</div>
<span data-image_population="${makePlaceholder({
          content: "{brizy_dc_collection_item_field size='custom}"
        })}" class="text-population" data-population="${makePlaceholder({
          content: "{{brizy_dc_collection_item_field size='custom'}}"
        })}">#Publish date</span>
<span class="text-population" data-image_population="${makePlaceholder({
          content: "{brizy_dc_collection_item_field size='custom}"
        })}">#Publish date 111</span></div>`
      }
    ]
  ])("no. %#", (v, expected) => {
    expect(m2.cb({ v, vs: v, vd: v, renderContext: "editor" })).toStrictEqual(
      expected
    );
  });
});
