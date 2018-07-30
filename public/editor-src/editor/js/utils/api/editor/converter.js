import _ from "underscore";

export default {
  pageToBackend: function(page) {
    /*
     * 1. remove dirty
     * 2. index (true, false) -> is_index (1, 0)
     */
    return _.extend(_.omit(page, "dirty", "index"), {
      is_index: page.index ? 1 : 0
    });
  },

  pageFromBackend: function(page) {
    /*
     * 1. id (int) -> id (string)
     * 2. is_index -> index
     */
    return _.extend(_.omit(page, "id", "is_index"), {
      id: page.id + "",
      index: page.is_index
    });
  },

  imageToBackend: function(image) {
    /*
     * 1. base64 -> attachment
     */
    return {
      attachment: image.base64
    };
  }
};
