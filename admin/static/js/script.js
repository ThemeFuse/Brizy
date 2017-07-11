jQuery(document).ready(function ($) {
  var xhr = false
  var id = Brizy_Admin_Data.id
  var url = Brizy_Admin_Data.url
  var actions = Brizy_Admin_Data.actions
  var enableButton = $('#brizy-admin-enable')
  var disableButton = $('#brizy-admin-disable')
  var hideEditor = function () {
    $('body').addClass('brizy-editor-enabled')
  }
  var showEditor = function () {
    $('body').removeClass('brizy-editor-enabled')
  }
  var request = (function () {
    var xhr = false
    return function (action, done) {
      if (xhr) {
        return
      }
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