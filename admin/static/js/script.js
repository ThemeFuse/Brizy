jQuery(document).ready(function ($) {
  var xhr = false
  var id = BitBlox_WP_Admin_Data.id
  var url = BitBlox_WP_Admin_Data.url
  var actions = BitBlox_WP_Admin_Data.actions
  var enableButton = $('#bitblox-wp-admin-enable')
  var disableButton = $('#bitblox-wp-admin-disable')
  var hideEditor = function () {
    $('body').addClass('bitblox-editor-enabled')
  }
  var showEditor = function () {
    $('body').removeClass('bitblox-editor-enabled')
  }
  var request = (function () {
    if (xhr) {
      return
    }

    return function (action, done) {
      xhr = true
      $.post(url, {
        action: action,
        id: id
      })
       .done(done)
       .always(function () {
         xhr = false
       })
    }
  })()

  enableButton.on('click', function (e) {
    e.preventDefault()
    request(actions.enable, function (response) {
      hideEditor()
      location.href = response.data.redirect
    })
  })
  disableButton.on('click', function (e) {
    e.preventDefault()
    request(actions.disable, showEditor)
  })
})