function bitblox_wp_redirect (id) {
  var xhr = false
  var url = BitBlox_WP_Admin_Data.url
  var action = BitBlox_WP_Admin_Data.action

  if (xhr) {
    return
  }

  xhr = true
  jQuery.post(url, {
    action: action,
    id: id
  })
        .done(function (response) {
          location.href = response.data.redirect
        })
        .fail(function (response) {

        })
        .always(function () {
          xhr = false
        })
}