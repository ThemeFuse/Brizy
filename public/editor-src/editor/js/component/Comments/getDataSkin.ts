import { ConfigCommon } from "visual/global/Config/types/configs/ConfigCommon";
import { assetUrl } from "visual/utils/asset";

export const getDataSkin = (config: ConfigCommon) => {
  return {
    skin1: [
      {
        photo: `${assetUrl("editor/img/skin1-1.jpg", config)}`,
        name: "Quenten Kortum",
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis. In comdimentum facilisis porta. Sed nec diam mattis viverra. Nulla fringilla, orci ac euismod semper, magna diam porttitor mauris, quis sollictudin sapien justo in libero."
      },
      {
        photo: `${assetUrl("editor/img/skin1-2.jpg", config)}`,
        name: "Uzoma Buchi",
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis. In comdimentum facilisis porta. Sed nec diam mattis viverra. Nulla fringilla, orci ac euismod semper, magna diam porttitor mauris, quis sollictudin sapien justo in libero.",
        children: [
          {
            photo: `${assetUrl("editor/img/skin1-3.jpg", config)}`,
            name: "Sukhnam Chander",
            message:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis. In condimentum facilisis porta. Sed nec diam eu diam mattis viverra. Nulla fringilla, orci ac eusmod semper."
          }
        ]
      },
      {
        photo: `${assetUrl("editor/img/skin1-4.jpg", config)}`,
        name: "Ivan Morais",
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus luctus urna sed urna ultricies ac tempor dui sagittis. In comdimentum facilisis porta. Sed nec diam mattis viverra. Nulla fringilla, orci ac euismod semper, magna diam porttitor mauris, quis sollictudin sapien justo in libero."
      }
    ],
    skin2: [
      {
        photo: `${assetUrl("editor/img/skin1-1.jpg", config)}`,
        name: "Quenten Kortum",
        message:
          "Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Viva mus luctus urna sed urna ultri cies ac tempor dui sagittis. In condi men tum facilisis porta. Sed nec diam mattis viverra."
      },
      {
        photo: `${assetUrl("editor/img/skin1-2.jpg", config)}`,
        name: "Kwak Seong-Min",
        message:
          "Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Viva mus luctus urna sed urna ultri cies ac tempor dui sagittis. In condi men tum facilisis porta. Sed nec diam mattis viverra.",
        children: [
          {
            photo: `${assetUrl("editor/img/skin1-3.jpg", config)}`,
            name: "Xenie Dolezelova",
            message:
              "Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Viva mus luctus urna sed urna ultri cies ac tempor dui sagittis. In condi men tum facilisis porta. Sed nec diam mattis viverra."
          }
        ]
      },
      {
        photo: `${assetUrl("editor/img/skin1-4.jpg", config)}`,
        name: "Benedikt Safiyulin",
        message:
          "Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Viva mus luctus urna sed urna ultri cies ac tempor dui sagittis. In condi men tum facilisis porta. Sed nec diam mattis viverra."
      }
    ],
    skin3: [
      {
        photo: `${assetUrl("editor/img/skin1-1.jpg", config)}`,
        name: "Quinten Kortum",
        message:
          "Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Viva mus luctus urna sed urna ultri cies ac tempor dui sagittis. In condi men tum facilisis porta. Sed nec diam mattis viverra."
      },
      {
        photo: `${assetUrl("editor/img/skin1-2.jpg", config)}`,
        name: "Jason Bailey",
        message:
          "Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Viva mus luctus urna sed urna ultri cies ac tempor dui sagittis. In condi men tum facilisis porta. Sed nec diam mattis viverra.",
        children: [
          {
            photo: `${assetUrl("editor/img/skin1-3.jpg", config)}`,
            name: "Kong Yijun",
            message:
              "Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Viva mus luctus urna sed urna ultri cies ac tempor dui sagittis. In condi men tum facilisis porta. Sed nec diam mattis viverra."
          }
        ]
      },
      {
        photo: `${assetUrl("editor/img/skin1-4.jpg", config)}`,
        name: "Emilee Simchenko",
        message:
          "Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Viva mus luctus urna sed urna ultri cies ac tempor dui sagittis. In condi men tum facilisis porta. Sed nec diam mattis viverra."
      }
    ],
    skin4: [
      {
        photo: `${assetUrl("editor/img/skin1-1.jpg", config)}`,
        name: "Arend Pellewever",
        message:
          "Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Viva mus luctus urna sed urna ultri cies ac tempor dui sagittis. In condi men tum facilisis porta. Sed nec diam mattis viverra."
      },
      {
        photo: `${assetUrl("editor/img/skin1-2.jpg", config)}`,
        name: "Otmar Dolezal",
        message:
          "Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Viva mus luctus urna sed urna ultri cies ac tempor dui sagittis. In condi men tum facilisis porta. Sed nec diam mattis viverra.",
        children: [
          {
            photo: `${assetUrl("editor/img/skin1-3.jpg", config)}`,
            name: "Ashish Asharaful",
            message:
              "Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Viva mus luctus urna ultri cies ac tempor dui sagittis. In condi men tum facilisis porta. Sed nec diam eu diam mattis."
          }
        ]
      },
      {
        photo: `${assetUrl("editor/img/skin1-4.jpg", config)}`,
        name: "Siri Jakobsson",
        message:
          "Lorem ipsum dolor sit amet, cons ectetur adi piscing elit. Viva mus luctus urna sed urna ultri cies ac tempor dui sagittis. In condi men tum facilisis porta. Sed nec diam mattis viverra."
      }
    ]
  };
};
