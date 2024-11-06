import { PageCommon } from "visual/types";

export const getDemoPage = (): PageCommon => ({
  data: {
    items: [
      {
        type: "Section",
        value: {
          _styles: ["section"],
          items: [
            {
              type: "SectionItem",
              value: {
                _styles: ["section-item"],
                items: [
                  {
                    type: "Wrapper",
                    value: {
                      _styles: ["wrapper", "wrapper--richText"],
                      items: [
                        {
                          type: "RichText",
                          value: {
                            _styles: ["richText"],
                            _id: "wbxhsrgjrgulawkwubdsobafqxrshyjkymbc",
                            text: '<p class="brz-tp-lg-paragraph" data-uniq-id="eyoqd" data-generated-css="brz-css-uubgd"><span class="brz-cp-color7">Demo HTML</span></p>'
                          }
                        }
                      ],
                      _id: "qzjhvlasdidhdtyevvowmxfcfxeuujfvivmi"
                    }
                  }
                ],
                _id: "pacieatduqpikwkmmlrteifhnrrexureqilp"
              }
            }
          ],
          _id: "quvjyeymzurjvsbgzlelckacxklrlrjbndgc"
        },
        blockId: "Kit2Blank000Light"
      }
    ]
  },
  dataVersion: 0,
  id: "demo-id",
  slug: "",
  status: "publish",
  title: "Demo page",
  dependencies: []
});
