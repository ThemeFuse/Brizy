import $ from "jquery";

export default function($node) {
  $node.find(".brz-input__upload").each(function() {
    const $this = $(this);
    const $input = $this.children(".brz-input");
    const $button = $this.find(".brz-button");
    const $placeholder = $this.find(".brz-span");

    $input.on("change", function() {
      const file = $input[0].files[0];
      const $delete = $this.find(".brz-input__upload-delete");

      if (file && file.name) {
        $placeholder.text(file.name);
        $button.addClass("brz-hidden");
        $delete.removeClass("brz-hidden");
        $input.prop("disabled", true);
      } else {
        resetUpload($this);
      }

      $delete.on("click", () => resetUpload($this));
    });
  });
}

function resetUpload($upload) {
  const $input = $upload.children(".brz-input");

  $upload.find(".brz-span").text($input.data("placeholder"));
  $input.val("");
  $upload.find(".brz-button").removeClass("brz-hidden");
  $upload.find(".brz-input__upload-delete").addClass("brz-hidden");

  setTimeout(function() {
    $input.prop("disabled", false);
  }, 500);
}
