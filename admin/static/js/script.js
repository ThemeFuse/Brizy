jQuery(document).ready(function ($) {

    $('.enable-brizy-editor').on('click', function (event) {
        event.preventDefault();

        jQuery(window).off('beforeunload.edit-post');

        if (wp.autosave) {
            wp.autosave.server.triggerSave();
        }

        window.location = $(this).attr('href');
    });

    var BrizyGutenberg = {

        insertBrizyBtn: function () {
            $('#editor').find('.edit-post-header-toolbar').append($('#brizy-gutenberg-btn-switch-mode').html());

            var html = $('#brizy-gutenberg-btn-middle').html();

            if(html)
            {
                $('#editor').find('.editor-block-list__layout>*').css('display', 'none');
                $('#editor').find('.editor-block-list__layout').append(html);
            }
        },

        init: function () {
            var self = this;
            setTimeout(function () {
                self.insertBrizyBtn();
            }, 1);
        }
    };

    $(function () {
        BrizyGutenberg.init();
    });
});


