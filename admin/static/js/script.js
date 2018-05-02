jQuery(document).ready(function ($) {
    $('.enable-brizy-editor').on('click', function (event) {
        event.preventDefault();

        jQuery(window).off( 'beforeunload.edit-post' );

        if ( wp.autosave ) {
            wp.autosave.server.triggerSave();
        }

        window.location = $(this).attr('href');
    })
});
// jQuery(document).ready(function ($) {
//     var id = Brizy_Admin_Data.id;
//     var url = Brizy_Admin_Data.url;
//     var actions = Brizy_Admin_Data.actions;
//     var enableButton = $('#brizy-admin-enable');
//     var disableButton = $('#brizy-admin-disable');
//
//     var hideEditor = function () {
//         $('body').addClass('brizy-editor-enabled');
//     };
//
//     var showEditor = function () {
//         $('body').removeClass('brizy-editor-enabled');
//     };
//
//     var request = (function () {
//         var xhr = false;
//         return function (action, done) {
//             if (xhr) {
//                 return
//             }
//             xhr = true;
//
//
//             return $.post(url, {
//                 action: action,
//                 id: id
//             })
//                 .done(done)
//                 .always(function () {
//                     xhr = false
//                 });
//         };
//     })();
//
//     enableButton.on('click', function (e) {
//         e.preventDefault();
//         var buttonContent = enableButton.html();
//         enableButton.html('Redirecting...');
//         request(actions.enable, function (response) {
//             hideEditor();
//             location.href = response.data.redirect;
//         }).always(function(){
//             enableButton.html(buttonContent);
//         });
//     });
//
//     disableButton.on('click', function (e) {
//         e.preventDefault();
//         request(actions.disable, showEditor);
//     });
// });