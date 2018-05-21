(function ($) {
  $('body').on('click', '.brizy-public-update-button', function (e) {
    e.preventDefault()
    var xhr = false
    var url = Brizy_Public_Data.url
    var action = Brizy_Public_Data.action
    var id = Brizy_Public_Data.id

    if (xhr) {
      return
    }

    $(this).addClass('loading')

    xhr = true
    jQuery.post(url, {
      action: action,
      id: id
    }).always(function () {
      xhr = false
      $(this).removeClass('loading')
    })
  })
})(jQuery)