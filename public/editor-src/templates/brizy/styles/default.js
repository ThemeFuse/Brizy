export default {
  id: "default",
  title: "Brizy default",
  colorPalette: [
    {
      id: "color1",
      hex: "#191b21"
    },
    {
      id: "color2",
      hex: "#142850"
    },
    {
      id: "color3",
      hex: "#239ddb"
    },
    {
      id: "color4",
      hex: "#66738d"
    },
    {
      id: "color5",
      hex: "#bde1f4"
    },
    {
      id: "color6",
      hex: "#eef0f2"
    },
    {
      id: "color7",
      hex: "#73777f"
    },
    {
      id: "color8",
      hex: "#ffffff"
    }
  ],
  fontStyles: [
    {
      deletable: "off",
      id: "paragraph",
      title: "Paragraph",
      fontFamily: "noto_serif",
      fontSize: 16,
      fontWeight: 300,
      lineHeight: 1.7,
      letterSpacing: 0,
      mobileFontSize: 15,
      mobileFontWeight: 300,
      mobileLineHeight: 1.6,
      mobileLetterSpacing: 0
    },
    {
      deletable: "off",
      id: "subtitle",
      title: "Subtitle",
      fontFamily: "noto_serif",
      fontSize: 18,
      fontWeight: 300,
      lineHeight: 1.5,
      letterSpacing: 0,
      mobileFontSize: 17,
      mobileFontWeight: 300,
      mobileLineHeight: 1.5,
      mobileLetterSpacing: 0
    },
    {
      deletable: "off",
      id: "abovetitle",
      title: "Above Title",
      fontFamily: "montserrat",
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.7,
      letterSpacing: 2,
      mobileFontSize: 13,
      mobileFontWeight: 400,
      mobileLineHeight: 1.7,
      mobileLetterSpacing: 2
    },
    {
      deletable: "off",
      id: "heading1",
      title: "Heading 1",
      fontFamily: "montserrat",
      fontSize: 56,
      fontWeight: 200,
      lineHeight: 1.3,
      letterSpacing: -1.5,
      mobileFontSize: 34,
      mobileFontWeight: 200,
      mobileLineHeight: 1.3,
      mobileLetterSpacing: -1
    },
    {
      deletable: "off",
      id: "heading2",
      title: "Heading 2",
      fontFamily: "montserrat",
      fontSize: 42,
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: -1.5,
      mobileFontSize: 29,
      mobileFontWeight: 700,
      mobileLineHeight: 1.3,
      mobileLetterSpacing: -0.5
    },
    {
      deletable: "off",
      id: "heading3",
      title: "Heading 3",
      fontFamily: "montserrat",
      fontSize: 32,
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: -1,
      mobileFontSize: 22,
      mobileFontWeight: 600,
      mobileLineHeight: 1.3,
      mobileLetterSpacing: 0
    },
    {
      deletable: "off",
      id: "heading4",
      title: "Heading 4",
      fontFamily: "montserrat",
      fontSize: 26,
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: -1,
      mobileFontSize: 21,
      mobileFontWeight: 500,
      mobileLineHeight: 1.4,
      mobileLetterSpacing: 0
    },
    {
      deletable: "off",
      id: "heading5",
      title: "Heading 5",
      fontFamily: "montserrat",
      fontSize: 20,
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: 0,
      mobileFontSize: 18,
      mobileFontWeight: 500,
      mobileLineHeight: 1.4,
      mobileLetterSpacing: 0
    },
    {
      deletable: "off",
      id: "heading6",
      title: "Heading 6",
      fontFamily: "montserrat",
      fontSize: 17,
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: 0,
      mobileFontSize: 16,
      mobileFontWeight: 500,
      mobileLineHeight: 1.4,
      mobileLetterSpacing: 0
    },
    {
      deletable: "off",
      id: "button",
      title: "Button",
      fontFamily: "montserrat",
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.8,
      letterSpacing: 3,
      mobileFontSize: 12,
      mobileFontWeight: 600,
      mobileLineHeight: 1.8,
      mobileLetterSpacing: 3
    }
  ],
  rules: {
    "wrapper--iconText": {
      showToolbar: "on"
    },
    "wrapper--tabs": {
      showToolbar: "on"
    },
    "wrapper--accordion": {
      showToolbar: "on"
    },
    "wrapper--imageGallery": {
      showToolbar: "on"
    },
    "wrapper--spacer": {
      marginTop: 0,
      marginBottom: 0,
      mobileMarginTop: 0,
      mobileMarginBottom: 0
    },
    "wrapper--carousel": {
      showToolbar: "on"
    },
    "wrapper--posts": {
      showToolbar: "on",
      paddingType: "ungrouped",
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 15,
      paddingRight: 15
    },
    "column--carousel": {
      width: 100
    },
    "richText--carousel": {
      text:
        "<p class='brz-tp-paragraph brz-text-lg-center'><span class='brz-cp-color7'>No matter if you've used a visual page builder before, with Brizy you'll be a pro the second you start using it.</span></p>"
    },
    "hide-row-borders": {
      showToolbar: "off"
    },
    "padding-0": {
      padding: 0
    },
    submit: {
      type: "submit"
    },
    "posts--column": {
      width: 100
    },
    "posts--archives": {
      type: "archives",
      taxonomy: "template",
      taxonomyId: "main_query",
      pagination: "on"
    },
    "image--dynamic": {
      imagePopulation: "{{brizy_dc_img_featured_image}}"
    },
    "button--dynamic": {
      linkExternalType: "linkPopulation",
      linkPopulation: "{{brizy_dc_url_post}}",
      text: "READ MORE",
      borderRadius: 2,
      borderWidth: 2,
      fontSize: 11,
      paddingBottom: 11,
      paddingLeft: 26,
      paddingRL: 26,
      paddingRight: 26,
      paddingTB: 11,
      paddingTop: 11,
      size: "small",
      tempPaddingBottom: 11,
      tempPaddingLeft: 26,
      tempPaddingRL: 26,
      tempPaddingRight: 26,
      tempPaddingTB: 11,
      tempPaddingTop: 11,
      mobileBorderRadius: 2,
      mobilePaddingBottom: 11,
      mobilePaddingLeft: 26,
      mobilePaddingRight: 26,
      mobilePaddingTop: 11,
      mobileSize: "small"
    },
    "richText-title--dynamic": {
      text:
        "<p class='brz-text-lg-center brz-tp-heading4'><span class='brz-cp-color2'><span data-population='brizy_dc_post_title'>#Post Title</span>&nbsp;</span></p>"
    },
    "richText-desc--dynamic": {
      text:
        "<p class='brz-text-lg-center brz-tp-paragraph'><span class='brz-cp-color7'><span data-population='brizy_dc_post_excerpt'>#Post Excerpt</span></span></p>"
    }
  }
};
