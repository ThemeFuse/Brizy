import $ from "jquery";

export default function() {
  $(".brz-control__select").each(function() {
    var $this = $(this);
    var $currentWrap = $this.find(".brz-control__select-current");
    var $currentOption = $currentWrap.find(".brz-control__select-option");
    var $options = $this.find(".brz-control__select-options");
    var $option = $options.find(".brz-control__select-option");

    $currentWrap.on("click", function() {
      $options.toggle();
    });

    $option.on("click", function() {
      $(this)
        .parent()
        .children()
        .removeClass("active");
      $(this).addClass("active");
      $this.find("input[type=hidden]").val($(this).text());
      $currentOption.html($(this).html());
      $options.hide();
    });

    // Reset Select to defaultValue when trigger onChange
    $this.find("input[type=hidden]").on("change", function() {
      var defaultValue = $option.html();
      $currentOption.html(defaultValue);
      $(this).val(defaultValue);
    });

    $(window).on("click", function(e) {
      var $elem = $(e.target);
      if (!$elem.closest($this).length) {
        $options.hide();
      }
    });
  });
}
