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
                text: Brizy_Admin_Data.l10n.deactivateFeedbackSubmitBtn,
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

                    setTimeout( function() {
                        location.href = $( 'tr[data-slug="brizy"] .deactivate a' ).attr( 'href' );
                    }, 1500 );
                }
            },
            {
                text: Brizy_Admin_Data.l10n.deactivateFeedbackSkipBtn,
                class: 'brz-feedback-skip',
                click: function () {
                    location.href = $( 'tr[data-slug="brizy"] .deactivate a' ).attr( 'href' );
                }
            }
        ],
        show: {
            effect: 'blind',
            duration: 5000
        },
        open: function () {
            var overlay = $('.ui-widget-overlay');

            overlay.addClass( 'brz-deactivate-overlay' );

            $( '.brz-feedback-text' ).addClass( 'hidden' );
            $( '.brz-deactivate-modal input:radio' ).prop( 'checked', false );

            // close dialog by clicking the overlay behind it
            overlay.bind( 'click', function () {
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

        var radio = $( this ),
            submitBtn = $( '.brz-feedback-submit' );

        $( '.brz-feedback-text' ).addClass( 'hidden' );
        submitBtn.prop( 'disabled', false );

        if ( radio.val() === 'brizy_pro' ) {
            submitBtn.prop( 'disabled', true );
        }

        radio.parent().find( '.brz-feedback-text' ).removeClass( 'hidden' );
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


