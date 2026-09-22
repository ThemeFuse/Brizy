jQuery(document).ready(function ($) {

    $('.brz-review-deserve, .brz-review-later, .brz-review-done').on('click', function (e) {

        var btn = $(this),
            notice = btn.closest('.brz-notice');

        if (!btn.hasClass('brz-review-deserve')) {
            e.preventDefault();
        }

        $.ajax({
            url: Brizy_Admin_Data.url,
            type: 'POST',
            data: {
                'action': 'brizy-dismiss-notice',
                'nonce': Brizy_Admin_Data.nonce,
                'repeat': !!btn.hasClass('brz-review-later')
            }
        });

        notice.animate({
            opacity: '-=1'
        }, 1000, function () {
            notice.remove();
        });
    });

    $('#brz-replace-url-button').on('click', function (e) {
        e.preventDefault();

        var self = $(this),
            tr = self.parents('tr'),
            from = tr.find('[name="from"]'),
            to = tr.find('[name="to"]');

        self.removeClass('success').addClass('loading');

        if (!self.hasClass('loading')) {
            return;
        }

        $.post(Brizy_Admin_Data.url, {
            action: 'brizy_replace_url',
            from: from.val(),
            to: to.val(),
            nonce: Brizy_Admin_Data.nonce
        }).done(function (response) {
            self.removeClass('loading');

            if (response.success) {
                self.addClass('success');
            }

            alert(response.data.message);
        }).error(function (response) {

            self.removeClass('success').removeClass('loading');

            alert(response.responseText);
        });
    });

    var BrizyFeedbackDialog = {

        init: function () {

            if (!$('#brz-deactivate-feedback-dialog').length && typeof dialog !== "function") {
                return;
            }

            this.initDialog();

            $('tr[data-slug="brizy"] .deactivate').click(function (e) {
                e.preventDefault();
                $('#brz-deactivate-feedback-dialog').dialog('open');
            });

            $('#brz-deactivate-feedback-dialog input:radio').change(function () {

                var radio = $(this),
                    submitBtn = $('.brz-feedback-submit'),
                    skipBtn = $('.brz-feedback-skip');

                $('.brz-feedback-text').addClass('hidden');
                submitBtn.prop('disabled', false);
                skipBtn.prop('disabled', false);

                if (radio.val() === 'brizy_pro') {
                    submitBtn.prop('disabled', true);
                    skipBtn.prop('disabled', true);
                }

                radio.parent().find('.brz-feedback-text').removeClass('hidden');
            });
        },
        submitFeedback: function () {

            var redirect = false;

            $('#brz-deactivate-feedback-dialog input:radio').each(function () {
                if ($(this).is(':checked')) {
                    redirect = true;
                }
            });

            if (!redirect) {
                return;
            }

            $('.brz-feedback-submit .ui-button-text').addClass('brz-loading').text('');

            $.ajax({
                url: Brizy_Admin_Data.url,
                type: 'POST',
                data: {
                    'action': 'brizy-send-feedback',
                    'nonce': Brizy_Admin_Data.nonce,
                    'form': $('form.brz-deactivate-feedback-dialog-form').serialize()
                }
            });

            setTimeout(function () {
                location.href = $('tr[data-slug="brizy"] .deactivate a').attr('href');
            }, 1000);
        },
        initDialog: function () {

            $('#brz-deactivate-feedback-dialog').dialog({
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
                            location.href = $('tr[data-slug="brizy"] .deactivate a').attr('href');
                        }
                    }
                ],
                open: function () {
                    var overlay = $('.ui-widget-overlay');

                    overlay.addClass('brz-deactivate-overlay');

                    $('.brz-feedback-text').addClass('hidden');
                    $('.brz-deactivate-modal input:radio').prop('checked', false);

                    // close dialog by clicking the overlay behind it
                    overlay.bind('click', function () {
                        $('#brz-deactivate-feedback-dialog').dialog('close');
                    });

                    $('.brz-feedback-submit').prop('disabled', false);
                    $('.brz-feedback-skip').prop('disabled', false);
                },
                create: function () {
                    // style fix for WordPress admin
                    $('.ui-dialog-titlebar-close').addClass('ui-button');
                },
            });
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
    $('#get-help,#go-pro').parent().attr('target', '_blank');

    var BrizyAiButton = {

        isAvailable: function () {
            return typeof Brizy_Admin_Data !== 'undefined' &&
                !Brizy_Admin_Data.isWhiteLabel &&
                Brizy_Admin_Data.aiActions &&
                Object.keys(Brizy_Admin_Data.aiActions).length > 0;
        },

        create: function () {
            if (!this.isAvailable()) {
                return null;
            }

            var tpl = $('#brizy-ai-btn-tpl').html();
            if (!tpl) {
                return null;
            }

            var $btn = $(tpl);
            var isLicenseValid = typeof Brizy_Admin_Data.isLicenseValid !== 'undefined' && Brizy_Admin_Data.isLicenseValid;

            if (isLicenseValid) {
                $btn.addClass('brz-ai-button--active');
                $btn.on('click', function (e) {
                    e.preventDefault();

                    if (!/[?&]post=\d+/.test(window.location.href) && Brizy_Admin_Data.id) {
                        var newUrl = window.location.origin + window.location.pathname +
                            '?post=' + Brizy_Admin_Data.id + '&action=edit';
                        window.history.replaceState(null, '', newUrl);
                    }

                    if (typeof window.BrizyAiGetPostId === 'function') {
                        window.BrizyAiGetPostId(this);
                    }
                });
            } else {
                $btn.addClass('brz-ai-button--disabled');
                $btn.on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });
            }

            return $btn;
        },

        appendTo: function ($container) {
            if (!$container || !$container.length) {
                return;
            }

            if ($container.find('.brz-ai-button.js-open-ai-selection-modal').length) {
                return;
            }

            var $btn = this.create();
            if ($btn) {
                $container.append($btn);
            }
        }
    };

    var BrizyBlockEditorDiag = {
        observers: 0,
        listeners: 0,
        reconciles: 0,

        report: function () {
            return {
                scope: window.frameElement ? 'canvas' : 'admin',
                observers: this.observers,
                listeners: this.listeners,
                ctas: document.querySelectorAll('[data-brizy-cta]').length,
                reconciles: this.reconciles
            };
        }
    };

    window.__brizyBlockEditorDiag = function () {
        return BrizyBlockEditorDiag.report();
    };

    var BrizyCanvasCta = {

        ROOT: '.is-root-container',
        ANCHOR: '.editor-visual-editor__post-title-wrapper, .edit-post-visual-editor__post-title-wrapper',
        HIDDEN_CLASS: 'brizy-canvas-hidden',

        data: null,
        hidden: null,
        pending: false,
        observer: null,
        failed: false,

        isActive: function () {
            var d = typeof Brizy_Admin_Data !== 'undefined' ? Brizy_Admin_Data.blockEditor : null;

            if (!d || d.supported !== true || d.enabled !== true || d.isNew === true || !d.editUrl) {
                return false;
            }

            this.data = d;

            return true;
        },

        build: function () {
            var d = this.data,
                $cta = $('<div class="brizy-buttons brizy-buttons-gutenberg brizy-cta" data-brizy-cta="1"></div>'),
                $link = $('<a class="brizy-cta__link"></a>').attr('href', d.editUrl),
                $button = $('<span class="brizy-cta__button"></span>');

            if (d.logoUrl) {
                $button.addClass('brizy-cta__button--logo');
                $button[0].style.setProperty('--brizy-cta-logo', 'url(' + JSON.stringify(d.logoUrl) + ')');
            }

            $button.append(document.createTextNode(d.ctaLabel));
            $link.append($button);
            $cta.append($link);

            return $cta[0];
        },

        reconcile: function () {
            var root = document.querySelector(this.ROOT),
                ctas = document.querySelectorAll('[data-brizy-cta]'),
                anchor, cta, i;

            BrizyBlockEditorDiag.reconciles++;

            // No canvas content (yet), or the code editor view: leave the document alone.
            if (!root) {
                this.restore();
                for (i = 0; i < ctas.length; i++) {
                    ctas[i].parentNode.removeChild(ctas[i]);
                }
                return;
            }

            for (i = 1; i < ctas.length; i++) {
                ctas[i].parentNode.removeChild(ctas[i]);
            }

            cta = ctas[0] || this.build();
            anchor = document.querySelector(this.ANCHOR);

            if (anchor) {
                if (cta.previousElementSibling !== anchor) {
                    anchor.parentNode.insertBefore(cta, anchor.nextSibling);
                }
            } else if (cta.nextElementSibling !== root) {
                root.parentNode.insertBefore(cta, root);
            }

            if (this.hidden && this.hidden !== root) {
                this.restore();
            }

            if (this.hidden !== root) {
                this.hidden = root;
                this.hiddenAriaWas = root.getAttribute('aria-hidden');
            }

            if (!root.classList.contains(this.HIDDEN_CLASS)) {
                root.classList.add(this.HIDDEN_CLASS);
            }

            // Inline as well: a freshly created canvas document may run this before its
            // stylesheet has loaded, and the native content must never flash through.
            if (root.style.getPropertyValue('display') !== 'none') {
                root.style.setProperty('display', 'none', 'important');
            }

            if (root.getAttribute('aria-hidden') !== 'true') {
                root.setAttribute('aria-hidden', 'true');
            }
        },

        restore: function () {
            var root = this.hidden;

            if (!root) {
                return;
            }

            root.classList.remove(this.HIDDEN_CLASS);
            root.style.removeProperty('display');

            if (this.hiddenAriaWas === null) {
                root.removeAttribute('aria-hidden');
            } else {
                root.setAttribute('aria-hidden', this.hiddenAriaWas);
            }

            this.hidden = null;
        },

        schedule: function () {
            var self = this;

            if (this.pending) {
                return;
            }

            this.pending = true;

            setTimeout(function () {
                self.pending = false;

                try {
                    self.reconcile();
                } catch (e) {
                    if (!self.failed) {
                        self.failed = true;
                        console.error('Brizy: block editor call-to-action failed', e);
                    }
                }
            }, 0);
        },

        navigate: function (e) {
            var href = this.getAttribute('href');

            e.preventDefault();

            try {
                window.top.location.href = href;
            } catch (err) {
                window.location.href = href;
            }
        },

        init: function () {
            var self = this;

            if (!this.isActive()) {
                return;
            }

            // One delegated listener per document: never bound per call-to-action node.
            $(document).on('click', '[data-brizy-cta] a', this.navigate);
            BrizyBlockEditorDiag.listeners++;

            this.schedule();

            // One observer per document. document.body can still be null when the
            // canvas assets run from <head>, so observe the root element.
            this.observer = new MutationObserver(this.schedule.bind(this));
            this.observer.observe(document.documentElement, { childList: true, subtree: true });
            BrizyBlockEditorDiag.observers++;

            // A destroyed canvas must retain nothing.
            $(window).on('pagehide', function () {
                self.destroy();
            });
        },

        destroy: function () {
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
                BrizyBlockEditorDiag.observers--;
            }

            $(document).off('click', '[data-brizy-cta] a', this.navigate);
            BrizyBlockEditorDiag.listeners--;
        }
    };

    /**
     * Block editor header controls, admin document only.
     *
     * Keeps exactly one Brizy switch control ("Edit with Brizy" / "Back to
     * WordPress Editor", printed by compatibilities/gutenberg.php) and the AI
     * button in the editor header toolbar. Runs only where wp.data exists,
     * which excludes the canvas iframe. Core keeps the legacy
     * `edit-post-header-toolbar` class next to `editor-document-tools` for
     * plugins that inject into the toolbar.
     */
    var BrizyGutenberg = {

        TOOLBAR: '.editor-document-tools, .edit-post-header-toolbar',

        pending: false,
        observer: null,
        unsubscribe: null,

        toolbar: function () {
            var editor = document.getElementById('editor');

            return editor ? editor.querySelector(this.TOOLBAR) : null;
        },

        reconcile: function () {
            var toolbar = this.toolbar(),
                $toolbar, html;

            if (!toolbar) {
                return;
            }

            $toolbar = $(toolbar);

            if (!$toolbar.children('.brizy-buttons').length) {
                html = $('#brizy-gutenberg-btn-switch-mode').html();

                if (html) {
                    $toolbar.append($($.parseHTML($.trim(html))).filter('.brizy-buttons').attr('data-brizy-header', '1'));
                }
            }

            BrizyAiButton.appendTo($toolbar);
        },

        schedule: function () {
            var self = this;

            if (this.pending) {
                return;
            }

            this.pending = true;

            setTimeout(function () {
                self.pending = false;
                self.reconcile();
            }, 0);
        },

        init: function () {
            var self = this,
                editor = document.getElementById('editor');

            if (typeof wp === 'undefined' || !wp.data || !editor) {
                return;
            }

            this.schedule();

            // One store subscription and one observer: header re-renders are repaired
            // without store activity, store updates are coalesced into one reconcile.
            this.unsubscribe = wp.data.subscribe(function () {
                self.schedule();
            });

            this.observer = new MutationObserver(function () {
                self.schedule();
            });
            this.observer.observe(editor, { childList: true, subtree: true });

            BrizyBlockEditorDiag.observers++;
            BrizyBlockEditorDiag.listeners++;
        }
    };

    var BrizyClassicEditor = {
        init: function () {
            BrizyAiButton.appendTo($('.brizy-buttons.is-classic-editor'));
        }
    }

    var BrizyMaintenance = {
        getSelectAccessRole: function () {
            return $('#brizy-maintenance-access-role');
        },
        getSelectMode: function () {
            return $('select[name="brizy-maintenance[mode]"]');
        },
        handleEvents: function () {
            this.getSelectAccessRole().change(function (e) {
                var display = 'custom' === $(this).val() ? 'table-cell' : 'none';
                $('.brizy-maintenance-roles th, .brizy-maintenance-roles td').css('display', display);
            });

            this.getSelectMode().change(function (e) {
                var self = $(this),
                    trs = self.closest('table').find('tr:not(#brizy-maintenance-js-mode)');

                if (self.val()) {
                    trs.removeClass('hidden');
                } else {
                    trs.addClass('hidden');
                }
            });

            this.getSelectMode().trigger('change');
            this.getSelectAccessRole().trigger('change');
        },

        init: function () {
            if (!this.getSelectAccessRole().length) {
                return;
            }

            this.handleEvents();
        }
    };

    var DemoImport = {

        registerEvents: function () {
            var searchInput = $('.js-demo-input-search'),
                selectTerm = $('.brz-demo-filter-terms select'),
                filterLinks = $('.brz-wrap-demodata .js-filter-link');

            if (!searchInput.length) {
                return;
            }

            filterLinks.click(function (e) {
                e.preventDefault();
                filterLinks.removeClass('current');
                $(this).addClass('current');

                if (!$(this).attr('data-sort')) {
                    searchInput.val('');
                    selectTerm.val('').trigger('change');
                }

                DemoImport.searchDemo();
            });

            $('.theme-screenshot, .more-details, .theme-name').click(function (e) {
                window.open($(this).closest('.theme').attr('data-preview-link'), '_blank');
            });

            searchInput.on('keyup change search', function () {
                DemoImport.searchDemo();
            });

            selectTerm.select2();

            selectTerm.change(function () {
                DemoImport.searchDemo();
            });

            $('.brz-demo-item-install').click(function (e) {
                e.preventDefault();
                $('.brz-demo-modal-content').html($('#brz-demo-modal-content-install').html());
                $('.brz-demo-modal').addClass('brz-demo-show-modal');
                $('.js-demo-install').attr('data-demo-id', $(this).attr('data-demo-id'));
            });

            $(document).on('click', '.js-demo-data-close-modal, .brz-demo-show-modal', function (e) {

                var it = $(e.target);

                if ((it.closest('.brz-demo-modal-content').length !== 0 || !$('.brz-demo-modal-content-install-container').length) && !it.is('.js-demo-data-close-modal')) {
                    return;
                }

                $('.brz-demo-modal').removeClass('brz-demo-show-modal');
            });

            $(document).on('click', '.js-demo-install', function (e) {
                e.preventDefault();

                $('.brz-demo-modal-content').html($('#brz-demo-modal-content-installing').html());

                $.ajax({
                    url: Brizy_Admin_Data.url,
                    type: 'POST',
                    data: {
                        'action': 'brizy-import-demo',
                        'nonce': Brizy_Admin_Data.nonce,
                        'demo': $(this).attr('data-demo-id'),
                        'rmContent': $(this).attr('data-rm-content')
                    },
                    success: function (response) {
                        $('.brz-demo-modal-content').html($('#brz-demo-modal-content-success').html());
                        if (response.data.editHomepageUrl) {
                            $('.js-demo-data-edit-homepage').attr('href', response.data.editHomepageUrl);
                        }
                    },
                    error: function () {
                        $('.brz-demo-modal-content').html($('#brz-demo-modal-content-error').html());
                    }
                });
            });
        },
        searchDemo: function () {
            var search = $('.js-demo-input-search').val(),
                searchRegex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, ''), 'i'),
                term = $('.brz-demo-filter-terms select').val(),
                filterLink = $('.js-filter-link.current').attr('data-sort'),
                count = 0;

            $('.brz-wrap-demodata .themes .theme').each(function () {
                var keywords = $(this).data('keywords'),
                    name = $(this).data('name'),
                    terms = String($(this).data('terms')).split(','),
                    matchBySearch = search === '' || searchRegex.test(keywords) || searchRegex.test(name),
                    matchByTerms = term === '' || terms.includes(term),
                    matchByFilterLink = filterLink === '' || (filterLink === 'pro' && $(this).hasClass('brz-demo-is-pro')) || (filterLink === 'free' && $(this).hasClass('brz-demo-is-free'));

                if (matchBySearch && matchByTerms && matchByFilterLink) {
                    $(this).fadeIn('slow');
                    count++;
                } else {
                    $(this).fadeOut('slow');
                }
            });

            $('.brz-wrap-demodata .count').text(count);
        }
    };

    $(function () {
        BrizyCanvasCta.init();
        BrizyGutenberg.init();
        BrizyClassicEditor.init();
        BrizyFeedbackDialog.init();
        BrizyMaintenance.init();
        DemoImport.registerEvents();
    });
});