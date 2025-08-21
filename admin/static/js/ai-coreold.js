(function ($, window) {
  'use strict';

  var Ai = {
    openSelectionModal: function (e) {
      e.preventDefault();

      var $button = $(this);
      var originalText = $button.text();

      $button.prop('disabled', true);

      var effectivePrefix = Brizy_Admin_Data.aiPrefix || Brizy_Admin_Data.prefix;
      var effectiveNonce = Brizy_Admin_Data.aiNonce;

      var ajaxData = {
        action: effectivePrefix + Brizy_Admin_Data.aiActions.createSession,
        hash: effectiveNonce
      };

      $('.brz-demo-modal-content').html($('#brz-demo-modal-content-installing').html());
      $('.brz-demo-modal-content .brz-demo-modal-content-h3').text(Brizy_Admin_Data.l10n.aiCreatingSessionTitle);
      $('.brz-demo-modal-content .brz-demo-modal-content-p').text(Brizy_Admin_Data.l10n.aiCreatingSessionDesc);
      $('.brz-demo-modal').addClass('brz-demo-show-modal');

      $.ajax({
        url: Brizy_Admin_Data.url,
        type: 'POST',
        data: ajaxData
      })
        .done(function (response) {
          if (response && response.success) {
            $('.brz-demo-modal-content').html($('#brz-demo-modal-content-install').html());
            $('.brz-demo-modal').addClass('brz-demo-show-modal');

            $('.brz-demo-modal-content .js-demo-install').prop('disabled', true);

            if (response.data && response.data.aiUrl) {
              var $deleteBtn = $('.brz-demo-modal-content .js-demo-install[data-rm-content="1"]');
              $deleteBtn.prop('disabled', false);
              $deleteBtn.attr('data-ai-url', response.data.aiUrl);
              if (response.data.sessionId) {
                $deleteBtn.attr('data-session-id', response.data.sessionId);
              }
            }
          } else {
            $('.brz-demo-modal-content').html($('#brz-demo-modal-content-error').html());
            $('.brz-demo-modal').addClass('brz-demo-show-modal');
            if (window.console) {
              console.error(response && response.data ? response.data : response);
            }
          }
        })
        .fail(function (xhr, status, error) {
          $('.brz-demo-modal-content').html($('#brz-demo-modal-content-error').html());
          $('.brz-demo-modal').addClass('brz-demo-show-modal');
          if (window.console) {
            console.error('AJAX Error Details:', {
              status: status,
              error: error,
              responseText: xhr && xhr.responseText,
              statusCode: xhr && xhr.status,
              readyState: xhr && xhr.readyState
            });
          }
        })
        .always(function () {
          $button.text(originalText).prop('disabled', false);
        });
    },

    notifyStartedThenOpen: function (aiUrl, sessionId) {
      var effectivePrefix = Brizy_Admin_Data.aiPrefix || Brizy_Admin_Data.prefix;
      var payload = {
        action: effectivePrefix + Brizy_Admin_Data.aiActions.startedProject,
        hash: Brizy_Admin_Data.aiNonce,
        sessionId: sessionId || ''
      };

      $.ajax({ url: Brizy_Admin_Data.url, type: 'POST', data: payload })
        .always(function () {
          $.ajax({ url: aiUrl, type: 'GET' }).fail(function () {
            window.location.href = aiUrl;
          });
        })
        .fail(function () {
          $.ajax({ url: aiUrl, type: 'GET' }).fail(function () {
            window.location.href = aiUrl;
          });
        });
    },

    handleInstallClick: function ($btn/*, e */) {
      var aiUrl = $btn.attr('data-ai-url');
      var sessionId = $btn.attr('data-session-id');
      if (!aiUrl) return false;

      $('.brz-demo-modal-content').html($('#brz-demo-modal-content-installing').html());

      Ai.notifyStartedThenOpen(aiUrl, sessionId);
      return true;
    },

    init: function () {
      $(document).on('click', '.js-open-ai-selection-modal', Ai.openSelectionModal);

      try {
        var currentUrl = new URL(window.location.href);
        var pageParam = currentUrl.searchParams.get('page');
        var sessionId = currentUrl.searchParams.get('sessionId');

        if (
          pageParam === 'starter-templates' &&
          typeof sessionId === 'string' &&
          sessionId.trim() !== ''
        ) {
          $('.brz-demo-modal-content').html(
            $('#brz-demo-modal-content-installing').html()
          );
          $('.brz-demo-modal').addClass('brz-demo-show-modal');

          var ajaxData = {
            action: Brizy_Admin_Data.aiPrefix + Brizy_Admin_Data.aiActions.generateTemplate,
            hash: Brizy_Admin_Data.aiNonce,
            sessionId: sessionId
          };

          $.ajax({
            url: Brizy_Admin_Data.url,
            type: 'POST',
            data: ajaxData
          })
            .done(function (response) {
              if (window.console) {
                console.log(response && response.data ? response.data : response);
              }
              if (response && response.success) {
                $('.brz-demo-modal-content').html(
                  $('#brz-demo-modal-content-success').html()
                );
                if (response.data && response.data.editHomepageUrl) {
                  $('.js-demo-data-edit-homepage').attr(
                    'href',
                    response.data.editHomepageUrl
                  );
                }
              } else {
                $('.brz-demo-modal-content').html(
                  $('#brz-demo-modal-content-error').html()
                );
                if (window.console) {
                  console.error(response && response.data ? response.data : response);
                }
              }
            })
            .fail(function (xhr, status, error) {
              $('.brz-demo-modal-content').html(
                $('#brz-demo-modal-content-error').html()
              );
              if (window.console) {
                console.error('AJAX Error Details:', {
                  status: status,
                  error: error,
                  responseText: xhr && xhr.responseText,
                  statusCode: xhr && xhr.status,
                  readyState: xhr && xhr.readyState
                });
              }
            });
        }
      } catch (e) {
        // no-op: URL parsing failed, safely ignore
      }
    }
  };

  window.Brizy_Admin_Ai = {
    init: Ai.init,
    handleInstallClick: function ($btn, e) { return Ai.handleInstallClick($btn, e); }
  };

  $(function () { Ai.init(); });

})(jQuery, window);


