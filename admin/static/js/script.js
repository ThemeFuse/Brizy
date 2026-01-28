jQuery(document).ready(function ($) {

    $( '.brz-review-deserve, .brz-review-later, .brz-review-done' ).on( 'click', function ( e ) {

        var btn    = $( this ),
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

    $( '#brz-replace-url-button' ).on( 'click', function ( e ) {
        e.preventDefault();

        var self = $( this ),
            tr   = self.parents( 'tr' ),
            from = tr.find( '[name="from"]' ),
            to   = tr.find( '[name="to"]' );

        self.removeClass( 'success' ).addClass( 'loading' );

        if ( ! self.hasClass( 'loading' ) ) {
           return;
        }

        $.post( Brizy_Admin_Data.url, {
            action: 'brizy_replace_url',
            from: from.val(),
            to: to.val(),
            nonce: Brizy_Admin_Data.nonce
        } ).done( function ( response ) {
            self.removeClass( 'loading' );

            if ( response.success ) {
                self.addClass( 'success' );
            }

           alert( response.data.message );
        } ).error( function( response ) {

            self.removeClass( 'success' ).removeClass( 'loading' );

            alert( response.responseText );
        } );
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
                if (document.querySelector('.block-editor-writing-flow')) {
                    guten.find('.edit-post-visual-editor .block-editor-writing-flow').append(html);
                    guten.find('.editor-post-text-editor').after(html);
                    guten.find('.is-root-container.is-layout-flow').hide();
                } else {

                    var gutenbergIframe = $( 'iframe[name="editor-canvas"]' );

                    if ( gutenbergIframe.length > 0 ) {

                        gutenbergIframe.on( 'load', function () {
                            var gutenbergContentHide = gutenbergIframe.contents().find( 'body > .is-root-container.is-layout-flow' );

                            if ( gutenbergContentHide.length > 0 ) {

                                gutenbergContentHide.hide();

                                if ( !gutenbergIframe.contents().find( 'div.brizy-buttons.brizy-buttons-gutenberg' ).length > 0 ) {
                                    gutenbergIframe.contents().find( '.edit-post-visual-editor__post-title-wrapper' ).after( html );
                                    gutenbergIframe.contents().find( '.brizy-buttons-gutenberg .button-primary' ).addClass('components-button block-editor-media-placeholder__button block-editor-media-placeholder__upload-button is-primary');
                                    gutenbergIframe.contents().find( '.brizy-buttons-gutenberg .button-primary' ).parent('a').on('click', function (e) {
                                        e.preventDefault();
                                        window.parent.location.href = $(this).attr('href');
                                    });
                                }

                                $( '.brizy-buttons-gutenberg' ).css( {
                                    'margin-bottom': '0',
                                    'position': 'absolute'
                                } );
                            }
                        } );
                    }
                }
            }

            if ( typeof Brizy_Admin_Data !== 'undefined' && 
                     Brizy_Admin_Data.aiActions && 
                     Object.keys( Brizy_Admin_Data.aiActions ).length > 0 &&
                     ! $( '.brz-ai-button.js-open-ai-selection-modal' ).length ) {
                    
                    var generateAiButton = $( '<a class="button button-primary brz-ai-button js-open-ai-selection-modal" href="#" title="Generate With AI" style="font-size: 11px; font-weight: 500; padding: 5px 10px; height: auto; background: rgb(30, 58, 138); color: rgb(255, 255, 255); border: none; border-radius: 3px; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); display: inline-flex; align-items: center; gap: 4px; white-space: nowrap; align-self: flex-start; box-shadow: rgba(30, 58, 138, 0.2) 0px 1px 2px; margin-left: 8px;">' +
                        '<span>Generate With AI</span>' +
                        '<span class="brz-ai-button-icon" style="display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; margin-left: 1px; width: 12px; height: 12px;">' +
                            '<svg width="12px" height="12px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block; width: 12px; height: 12px;">' +
                                '<title>AI Icon</title>' +
                                '<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
                                    '<g id="Step-2" transform="translate(-1149, -610)" fill="#FFFFFF" fill-rule="nonzero">' +
                                        '<path d="M1154.33333,615.333333 C1154.82425,615.333333 1155.22222,615.731302 1155.22222,616.222222 C1155.22222,617.757576 1157.24242,619.777778 1158.77778,619.777778 C1159.2687,619.777778 1159.66667,620.175747 1159.66667,620.666667 C1159.66667,621.157586 1159.2687,621.555556 1158.77778,621.555556 C1157.0778,621.555556 1155.35817,623.34172 1155.22222,625.111111 C1155.18461,625.600588 1154.82425,626 1154.33333,626 C1153.84241,626 1153.4917,625.599751 1153.44444,625.111111 C1153.28133,623.424557 1151.19734,621.676618 1149.88889,621.555556 C1149.40006,621.510327 1149,621.157586 1149,620.666667 C1149,620.175747 1149.39797,619.777778 1149.88889,619.777778 C1151.61422,619.777778 1153.30894,617.628929 1153.44444,616.222222 C1153.49152,615.733564 1153.84241,615.333333 1154.33333,615.333333 Z M1162.57576,620.666667 C1162.91048,620.666667 1163.18182,620.938009 1163.18182,621.272727 C1163.18182,621.942163 1163.7245,622.484848 1164.39394,622.484848 C1164.72866,622.484848 1165,622.756191 1165,623.090909 C1165,623.425627 1164.72866,623.69697 1164.39394,623.69697 C1163.7245,623.69697 1163.18182,624.239655 1163.18182,624.909091 C1163.18182,625.243809 1162.91048,625.515152 1162.57576,625.515152 C1162.24104,625.515152 1161.9697,625.243809 1161.9697,624.909091 C1161.9697,624.239655 1161.42701,623.69697 1160.75758,623.69697 C1160.42286,623.69697 1160.15152,623.425627 1160.15152,623.090909 C1160.15152,622.756191 1160.42286,622.484848 1160.75758,622.484848 C1161.42701,622.484848 1161.9697,621.942163 1161.9697,621.272727 C1161.9697,620.938009 1162.24104,620.666667 1162.57576,620.666667 Z M1161.12121,610 C1161.65676,610 1161.91933,610.462379 1162.09091,610.969697 C1162.34915,611.733218 1163.37568,612.741286 1164.0303,612.909091 C1164.54908,613.042073 1165,613.343239 1165,613.878788 C1165,614.414337 1164.52882,614.652798 1164.0303,614.848485 C1163.50538,615.054537 1162.33869,616.084555 1162.09091,616.787879 C1161.91295,617.292997 1161.65676,617.757576 1161.12121,617.757576 C1160.58566,617.757576 1160.28335,617.306947 1160.15152,616.787879 C1159.97518,616.093614 1158.79726,614.979278 1158.21212,614.848485 C1157.68947,614.731659 1157.24242,614.414337 1157.24242,613.878788 C1157.24242,613.343239 1157.67657,612.909091 1158.21212,612.909091 C1158.83402,612.909091 1160.15152,611.584791 1160.15152,610.969697 C1160.15152,610.434148 1160.58566,610 1161.12121,610 Z M1151.90909,610 C1152.24381,610 1152.61095,610.283523 1152.70042,610.606061 C1152.88569,611.273913 1152.97759,611.4145 1153.73018,611.680868 C1154.04572,611.792548 1154.33333,612.089524 1154.33333,612.424242 C1154.33333,612.75896 1154.175,613.033142 1153.87085,613.172892 C1153.25209,613.457201 1152.88996,613.659113 1152.70042,614.242424 C1152.59698,614.560759 1152.24381,614.848485 1151.90909,614.848485 C1151.57437,614.848485 1151.13069,614.556681 1151.01546,614.242424 C1150.76381,613.556152 1150.41724,613.556152 1149.90086,613.172892 C1149.63209,612.973403 1149.48485,612.75896 1149.48485,612.424242 C1149.48485,612.089524 1149.771,611.779338 1150.09091,611.680868 C1150.87902,611.43828 1150.87902,611.192034 1151.14202,610.606061 C1151.27908,610.300691 1151.57437,610 1151.90909,610 Z" id="Combined-Shape"></path>' +
                                    '</g>' +
                                '</g>' +
                            '</svg>' +
                        '</span>' +
                    '</a>' );
                    
                    generateAiButton.on('mouseenter', function() {
                        $(this).css('background', '#2563eb');
                    }).on('mouseleave', function() {
                        $(this).css('background', 'rgb(30, 58, 138)');
                    });
                    
                    $( '#editor' ).find( '.edit-post-header-toolbar' ).append( generateAiButton );
                }
        },

        init: function () {
	        var self = this;

	        if (typeof wp.data != 'undefined') {
		        wp.data.subscribe(function () {
			        setTimeout( function () {
				        self.insertBrizyBtn();
			        }, 1 );

                    // if we are on wordpress.com
                    if ( window.location.href.includes("wordpress.com") ) {
                        $("#editor .is-desktop-preview div.brizy-buttons.brizy-buttons-gutenberg a:first").on("click", function (e) {
                            e.preventDefault();

                            window.top.location.href = $(this).attr("href");
                        });
                    }

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

    var DemoImport = {

        registerEvents: function () {
            var searchInput = $( '.js-demo-input-search' ),
                selectTerm  = $( '.brz-demo-filter-terms select' ),
                filterLinks = $( '.brz-wrap-demodata .js-filter-link' );

            if ( ! searchInput.length ) {
                return;
            }

            filterLinks.click( function( e ) {
                e.preventDefault();
                filterLinks.removeClass( 'current' );
                $( this ).addClass( 'current' );

                if ( ! $( this ).attr( 'data-sort' ) ) {
                    searchInput.val( '' );
                    selectTerm.val( '' ).trigger( 'change' );
                }

                DemoImport.searchDemo();
            } );

            $( '.theme-screenshot, .more-details, .theme-name' ).click( function( e ) {
                window.open( $( this ).closest( '.theme' ).attr( 'data-preview-link' ), '_blank' );
            } );

            searchInput.on('keyup change search', function() {
                DemoImport.searchDemo();
            });

            selectTerm.select2();

            selectTerm.change( function () {
                DemoImport.searchDemo();
            } );

            $( '.brz-demo-item-install' ).click( function( e ) {
                e.preventDefault();
                $( '.brz-demo-modal-content' ).html( $( '#brz-demo-modal-content-install' ).html() );
                $( '.brz-demo-modal' ).addClass( 'brz-demo-show-modal' );
                $( '.js-demo-install' ).attr( 'data-demo-id', $( this ).attr( 'data-demo-id' ) );
            } );

            $( document ).on( 'click', '.js-demo-data-close-modal, .brz-demo-show-modal', function( e ) {

                var it = $( e.target );

                if ( ( it.closest( '.brz-demo-modal-content' ).length !== 0 || ! $( '.brz-demo-modal-content-install-container' ).length ) && ! it.is( '.js-demo-data-close-modal' ) ) {
                   return;
                }

                $( '.brz-demo-modal' ).removeClass( 'brz-demo-show-modal' );
            } );

            $( document ).on( 'click', '.js-demo-install', function( e ) {
                e.preventDefault();
                
                $( '.brz-demo-modal-content' ).html( $( '#brz-demo-modal-content-installing' ).html() );

                $.ajax( {
                    url: Brizy_Admin_Data.url,
                    type: 'POST',
                    data: {
                        'action': 'brizy-import-demo',
                        'nonce': Brizy_Admin_Data.nonce,
                        'demo': $( this ).attr( 'data-demo-id' ),
                        'rmContent': $( this ).attr( 'data-rm-content' )
                    },
                    success: function(response) {
                        $( '.brz-demo-modal-content' ).html( $( '#brz-demo-modal-content-success' ).html() );
                        if ( response.data.editHomepageUrl ) {
                            $( '.js-demo-data-edit-homepage' ).attr( 'href', response.data.editHomepageUrl );
                        }
                    },
                    error: function() {
                        $( '.brz-demo-modal-content' ).html( $( '#brz-demo-modal-content-error' ).html() );
                    }
                } );
            } );
        },
        searchDemo: function () {
            var search      = $( '.js-demo-input-search' ).val(),
                searchRegex = new RegExp( search.replace(/[.*+?^${}()|[\]\\]/g, ''), 'i' ),
                term        = $( '.brz-demo-filter-terms select' ).val(),
                filterLink  = $( '.js-filter-link.current' ).attr( 'data-sort' ),
                count       = 0;

            $( '.themes .theme' ).each( function() {
                var keywords          = $( this ).data( 'keywords' ),
                    name              = $( this ).data( 'name' ),
                    terms             = String( $( this ).data( 'terms' ) ).split(','),
                    matchBySearch     = search === '' || searchRegex.test( keywords ) || searchRegex.test( name ),
                    matchByTerms      = term === '' || terms.includes( term ),
                    matchByFilterLink = filterLink === '' || ( filterLink === 'pro' && $( this ).hasClass( 'brz-demo-is-pro' ) ) || ( filterLink === 'free' && $( this ).hasClass( 'brz-demo-is-free' ) );

                if ( matchBySearch && matchByTerms && matchByFilterLink ) {
                    $( this ).fadeIn( 'slow' );
                    count++;
                } else {
                    $( this ).fadeOut( 'slow' );
                }
            });

            $( '.brz-wrap-demodata .count' ).text( count );
        }
    };

    $( function () {
        BrizyGutenberg.init();
        BrizyFeedbackDialog.init();
        BrizyMaintenance.init();
        DemoImport.registerEvents();
    } );
});