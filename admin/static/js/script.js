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

    var BrizyFeedbackDialog = {

        init: function () {

            if ( ! $( '#brz-deactivate-feedback-dialog' ).length && typeof dialog !== "function" ) {
                return;
            }

            this.initDialog();

            $( 'tr[data-slug="brizy"] .deactivate' ).click( function ( e ) {
                e.preventDefault();
                $( '#brz-deactivate-feedback-dialog' ).dialog( 'open' );
            } );

            $( '#brz-deactivate-feedback-dialog input:radio' ).change( function () {

                var radio     = $( this ),
                    submitBtn = $( '.brz-feedback-submit' ),
                    skipBtn   = $( '.brz-feedback-skip' );

                $( '.brz-feedback-text' ).addClass( 'hidden' );
                submitBtn.prop( 'disabled', false );
                skipBtn.prop( 'disabled', false );

                if ( radio.val() === 'brizy_pro' ) {
                    submitBtn.prop( 'disabled', true );
                    skipBtn.prop( 'disabled', true );
                }

                radio.parent().find( '.brz-feedback-text' ).removeClass( 'hidden' );
            } );
        },
        submitFeedback: function () {

            var redirect = false;

            $( '#brz-deactivate-feedback-dialog input:radio' ).each( function () {
                if ( $( this ).is( ':checked' ) ) {
                    redirect = true;
                }
            } );

            if ( !redirect ) {
                return;
            }

            $( '.brz-feedback-submit .ui-button-text' ).addClass( 'brz-loading' ).text( '' );

            $.ajax( {
                url: Brizy_Admin_Data.url,
                type: 'POST',
                data: {
                    'action': 'brizy-send-feedback',
                    'nonce': Brizy_Admin_Data.nonce,
                    'form': $( 'form.brz-deactivate-feedback-dialog-form' ).serialize()
                }
            } );

            setTimeout( function () {
                location.href = $( 'tr[data-slug="brizy"] .deactivate a' ).attr( 'href' );
            }, 1000 );
        },
        initDialog: function () {

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
                            BrizyFeedbackDialog.submitFeedback();
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
                open: function () {
                    var overlay = $('.ui-widget-overlay');

                    overlay.addClass( 'brz-deactivate-overlay' );

                    $( '.brz-feedback-text' ).addClass( 'hidden' );
                    $( '.brz-deactivate-modal input:radio' ).prop( 'checked', false );

                    // close dialog by clicking the overlay behind it
                    overlay.bind( 'click', function () {
                        $( '#brz-deactivate-feedback-dialog' ).dialog( 'close' );
                    } );

                    $( '.brz-feedback-submit' ).prop( 'disabled', false );
                    $( '.brz-feedback-skip' ).prop( 'disabled', false );
                },
                create: function () {
                    // style fix for WordPress admin
                    $( '.ui-dialog-titlebar-close' ).addClass( 'ui-button' );
                },
            } );
        }
    };

    $('.enable-brizy-editor').on('click', function (event) {
        event.preventDefault();

        jQuery(window).off('beforeunload.edit-post');

        if (wp.autosave) {
            wp.autosave.server.triggerSave();
        }

        window.location = $(this).attr('href');
    });

    // Open our submenu link "Get Help" in a new tab.
     $( '#get-help,#go-pro' ).parent().attr( 'target', '_blank' );

    var BrizyGutenberg = {

        insertBrizyBtn: function () {

        	if ( $( '.edit-post-header-toolbar .brizy-buttons' ).length ) {
        		return;
	        }

            var guten = $( '#editor' ),
                html = $( '#brizy-gutenberg-btn-middle' ).html();

            if ( ! guten ) {
                return;
            }

	        guten.find( '.edit-post-header-toolbar' ).append( $( '#brizy-gutenberg-btn-switch-mode' ).html() );

	        if ( html && ! $( '.brizy-buttons-gutenberg' ).length ) {
		        guten.find( '.edit-post-visual-editor .block-editor-writing-flow' ).append( html );
		        guten.find( '.editor-post-text-editor' ).after( html );
	        }
        },

        init: function () {
	        var self = this;

	        if (typeof wp.data != 'undefined') {
		        wp.data.subscribe(function () {
			        setTimeout( function () {
				        self.insertBrizyBtn();
			        }, 1 );
		        });
	        }
        }
    };

    var BrizyMaintenance = {
        getSelectAccessRole: function() {
            return $( '#brizy-maintenance-access-role' );
        },
        getSelectMode: function() {
            return $( 'select[name="brizy-maintenance[mode]"]' );
        },
        handleEvents: function () {
            this.getSelectAccessRole().change( function ( e ) {
                var display = 'custom' === $( this ).val() ? 'table-cell' : 'none';
                $( '.brizy-maintenance-roles th, .brizy-maintenance-roles td' ).css( 'display', display );
            } );

            this.getSelectMode().change( function ( e ) {
                var self = $( this ),
                    trs  = self.closest( 'table' ).find( 'tr:not(#brizy-maintenance-js-mode)' );

                if ( self.val() ) {
                    trs.removeClass( 'hidden' );
                } else {
                    trs.addClass( 'hidden' );
                }
            } );

            this.getSelectMode().trigger( 'change' );
            this.getSelectAccessRole().trigger( 'change' );
        },

        init: function () {
            if ( ! this.getSelectAccessRole().length ) {
                return;
            }

            this.handleEvents();
        }
    };

    $( function () {
        BrizyGutenberg.init();
        BrizyFeedbackDialog.init();
        BrizyMaintenance.init();
    } );
});


