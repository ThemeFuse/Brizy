jQuery(document).ready(function ($) {

    $( '.brz-review-deserve, .brz-review-later, .brz-review-done' ).on( 'click', function ( e ) {

        var btn = $( this );
            notice = btn.closest( '.brz-notice' );

        if ( ! btn.hasClass( 'brz-review-deserve' ) ) {
            e.preventDefault();
        }

        $.ajax( {
            url: Brizy_Admin_Data.url,
            type: 'POST',
            data: {
                'action': 'brizy-dismiss-notice',
                'nonce': Brizy_Admin_Data.nonce,
                'repeat': !!btn.hasClass( 'brz-review-later' )
            }
        } );

        notice.animate({
            opacity: '-=1'
        }, 1000, function() {
            notice.remove();
        });
    } );

    $( '#brz-deactivate-feedback-dialog' ).dialog( {
        dialogClass: 'brz-deactivate-modal',
        autoOpen: false,
        draggable: false,
        width: 'auto',
        modal: true,
        resizable: false,
        closeOnEscape: true,
        buttons: [
            {
                text: 'Submit & Deactivate',
                class: 'brz-feedback-submit',
                click: function () {

                    var redirect = false;

                    $( '#brz-deactivate-feedback-dialog input:radio' ).each( function() {
                        if ( $( this ).is( ':checked' ) ) {
                            redirect = true;
                        }
                    } );

                    if ( ! redirect ) {
                       return;
                    }

                    $( '.brz-feedback-submit .ui-button-text' ).addClass( 'brz-loading' ).text('');

                    $.ajax( {
                        url: Brizy_Admin_Data.url,
                        type: 'POST',
                        data: {
                            'action': 'brizy-deactivate-feedback',
                            'nonce': Brizy_Admin_Data.nonce,
                            'form': $( 'form.brz-deactivate-feedback-dialog-form' ).serialize()
                        }
                    } );

                    //location.href = $( 'tr[data-slug="brizy"] .deactivate a' ).attr( 'href' );
                }
            },
            {
                text: 'Skip & Deactivate',
                class: 'brz-feedback-skip',
                click: function () {
                    location.href = $( 'tr[data-slug="brizy"] .deactivate a' ).attr( 'href' );
                }
            }
        ],
        show: {
            effect: 'blind',
            duration: 4000
        },
        position: {
            my: 'center',
            at: 'center',
            of: window
        },
        open: function () {
            // close dialog by clicking the overlay behind it
            $( '.ui-widget-overlay' ).bind( 'click', function () {
                $( '#brz-deactivate-feedback-dialog' ).dialog( 'close' );
            } )
        },
        create: function () {
            // style fix for WordPress admin
            $( '.ui-dialog-titlebar-close' ).addClass( 'ui-button' );
        },
    } );

    $( 'tr[data-slug="brizy"] .deactivate' ).click( function ( e ) {
        e.preventDefault();
        $( '#brz-deactivate-feedback-dialog' ).dialog( 'open' );
    } );

    $( '#brz-deactivate-feedback-dialog input:radio' ).change( function () {
        $( '.brz-feedback-text' ).addClass( 'hidden' );
        $( this ).parent().find( '.brz-feedback-text' ).removeClass( 'hidden' );
    } );

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


