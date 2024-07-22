import { Font, getRichTextFamilies } from "../common";

describe("testing getRichTextFamilies", () => {
  test.each<[string, Array<Font>]>([
    ["asdasd", []],

    [
      `<p class='brz-ft-google brz-ff-lato'>asdadasd</p>`,
      [
        {
          type: "google",
          family: "lato"
        }
      ]
    ],

    [
      `<p class='brz-ft-google brz-ff-lato'>asdadasd</p><p class="brz-ff-rmo brz-ft-upload">test 2</p>`,
      [
        {
          type: "google",
          family: "lato"
        },
        {
          type: "upload",
          family: "rmo"
        }
      ]
    ],

    [
      `<p class='brz-ft-google brz-ff-lato'>1231444</p>
       <p class="brz-ff-rmo brz-ft-upload">test 2</p>
       <p class="brz-ff-system">test 44asd</p>`,
      [
        {
          type: "google",
          family: "lato"
        },
        {
          type: "upload",
          family: "rmo"
        }
      ]
    ],

    [
      `<p class='brz-fw-xs-im-400 brz-fw-sm-im-400 brz-fw-lg-400 brz-ls-xs-im-1 brz-ls-sm-im-1 brz-ls-lg-0 brz-ft-google brz-ff-reem_kufi brz-lh-lg-1_3 brz-lh-sm-im-1_2 brz-lh-xs-im-1_3 brz-fs-lg-39 brz-fs-sm-im-33 brz-fs-xs-im-31'><span style="color: rgb(66, 35, 43);'>We've got a </span><span style="color: rgb(220, 20, 72);">surprise</span><span style="color: rgb(66, 35, 43);"> for you!</span></p><p class="brz-fs-xs-im-27 brz-fs-sm-im-29 brz-fs-lg-35 brz-lh-lg-1_3 brz-lh-sm-im-1_2 brz-lh-xs-im-1_3 brz-ls-lg-0 brz-ls-sm-im-1 brz-ls-xs-im-1 brz-ff-reem_kufi brz-ft-google brz-fw-lg-400 brz-fw-sm-im-400 brz-fw-xs-im-400 brz-mt-lg-20"><span style="color: rgb(220, 20, 72);">%20 OFF </span></p><p class="brz-lh-xs-im-1_3 brz-lh-sm-im-1_3 brz-lh-lg-1_6 brz-fs-xs-im-19 brz-fs-sm-im-19 brz-fs-lg-20 brz-fw-xs-im-400 brz-fw-sm-im-400 brz-fw-lg-400 brz-ft-google brz-ff-reem_kufi brz-ls-xs-im-0 brz-ls-sm-im-0 brz-ls-lg-0"><span style="color: rgb(66, 35, 43);">after subscribing to our newsletter </span></p>`,
      [
        {
          type: "google",
          family: "reem_kufi"
        }
      ]
    ],
    [
      `
<h2 class="brz-text-xs-center brz-tp-lg-empty brz-ff-initial brz-ft-system brz-fs-lg-36 brz-fss-lg-px brz-fw-lg-400 brz-ls-lg-m_1_5 brz-lh-lg-1_3"
    data-generated-css="brz-css-gRjXO" data-uniq-id="b2jk3"><span class="brz-cp-color2">Download the </span></h2>
<h2 class="brz-text-xs-center brz-tp-lg-empty brz-ff-knewave brz-ft-google brz-fs-lg-36 brz-fss-lg-px brz-fw-lg-400 brz-ls-lg-m_1_5 brz-lh-lg-1_3"
    data-generated-css="brz-css-l2m3U" data-uniq-id="kfVLy"><span class="brz-cp-color2">mobile app or </span></h2>
<h2 class="brz-text-xs-center brz-tp-lg-subtitle" data-generated-css="brz-css-n_xg9" data-uniq-id="amsVa"><span
        class="brz-cp-color2">subscribe to </span></h2>
<h2 class="brz-text-xs-center brz-tp-lg-empty brz-ff-nunito brz-ft-google brz-fs-lg-36 brz-fss-lg-px brz-fw-lg-700 brz-ls-lg-m_1_5 brz-lh-lg-1_3"
    data-generated-css="brz-css-iYCu8" data-uniq-id="lcMwk"><span class="brz-cp-color2">our newsletter to stay in touch......</span>
</h2>
<h2 data-generated-css="brz-css-acyvQ" data-uniq-id="xNiPw" class="brz-text-xs-center brz-tp-lg-empty brz-ff-comfortaa brz-ft-google brz-fs-lg-36 brz-fss-lg-px brz-fw-lg-700 brz-ls-lg-m_1_5 brz-lh-lg-1_3">
<span class="brz-cp-color2">asdioaiONaionion </span></h2>`,
      [
        {
          type: "system",
          family: "initial"
        },
        {
          type: "google",
          family: "knewave"
        },
        {
          type: "google",
          family: "nunito"
        },
        {
          type: "google",
          family: "comfortaa"
        }
      ]
    ]
  ])("nr %#", (rule, apiRule) => {
    expect(getRichTextFamilies(rule)).toStrictEqual(apiRule);
  });
});
