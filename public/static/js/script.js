(function ($) {
  $('body').on('click', '.bitblox-wp-public-update-button', function (e) {
    e.preventDefault()
    var xhr = false
    var url = BitBlox_WP_Public_Data.url
    var action = BitBlox_WP_Public_Data.action
    var id = BitBlox_WP_Public_Data.id

    if (xhr) {
      return
    }

    console.log( id );

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