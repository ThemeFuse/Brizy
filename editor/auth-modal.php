<?php if (!defined('ABSPATH')) {
    die('Direct access forbidden.');
}

class Brizy_Editor_AuthModal
{
    public function __construct()
    {
        add_action('wp_footer', [$this, 'authModal']);
    }


    public function authModal()
    {
        if (!Brizy_Public_Main::is_editing()) {
            return;
        }
        ?>
        <style>
            .brizy-auth-modal {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.75);
                z-index: 99999;
                justify-content: center;
                align-items: center;
            }

            .brizy-auth-modal.is-visible {
                display: flex;
            }

            .brizy-auth-modal-content {
                text-align: center;
            }

            .brizy-auth-modal-content iframe {
                width: 115%;
                height: 460px;
                border-radius: 5px;
            }
        </style>

        <div id="brizy-auth-modal" class="brizy-auth-modal">
            <div class="brizy-auth-modal-content">
                <iframe
                    id="brizy-auth-iframe"
                    src="<?php echo wp_login_url(); ?>"
                    style="border:0px none #ffffff;"
                    name="brizyAuthIframe"
                    scrolling="no"
                    marginwidth="0"
                    marginheight="0"
                ></iframe>
            </div>
        </div>

        <script>
            document.addEventListener('DOMContentLoaded', function () {
                var authModal = document.getElementById('brizy-auth-modal');
                var ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>";
                var iframe = document.getElementById('brizy-auth-iframe');

                setInterval(function () {
                    jQuery.ajax({
                        type: 'POST',
                        url: ajaxurl,
                        data: {
                            'action': 'brizy_auth_status'
                        },
                        dataType: 'json',
                        complete: function (xhr, status) {
                            if (xhr.responseJSON && xhr.responseJSON.data && xhr.responseJSON.data.logged === true) {
                                if (typeof __BRZ_PLUGIN_ENV__ !== 'undefined') {
                                    __BRZ_PLUGIN_ENV__.hash = xhr.responseJSON.data.nonce;
                                }
                                closeAuthModal();
                            } else {
                                openAuthModal();
                            }
                        }
                    });
                }, 5000);

                function openAuthModal() {
                    if (authModal.classList.contains('is-visible')) {
                        return;
                    }

                    iframe.src = "<?php echo wp_login_url('', true).'&interim-login=1'; ?>";

                    setTimeout(function () {
                        authModal.classList.add('is-visible');
                    }, 500);

                    iframe.onload = function () {
                        try {
                            var iframeContent = iframe.contentWindow.document;
                            var loginForm = iframeContent.getElementById('loginform');

                            if (loginForm) {
                                loginForm.addEventListener('submit', function (e) {
                                    e.preventDefault();

                                    var formData = new FormData(loginForm);
                                    formData.append('action', 'brizy_login_handler');

                                    jQuery.ajax({
                                        type: 'POST',
                                        dataType: 'json',
                                        url: ajaxurl,
                                        data: Object.fromEntries(formData.entries()),
                                        success: function (response) {
                                            if (response.success) {
                                                if (typeof __BRZ_PLUGIN_ENV__ !== 'undefined') {
                                                    __BRZ_PLUGIN_ENV__.hash = response.data.nonce;
                                                }
                                                closeAuthModal();
                                            } else {
                                                var errorMessage = iframeContent.getElementById('login-error-message');
                                                if (errorMessage) {
                                                    errorMessage.textContent = response.data.message;
                                                    errorMessage.style.display = 'block';
                                                }
                                            }
                                        },
                                        error: function (xhr, status, error) {
                                        }
                                    });
                                });
                            }
                        } catch (e) {
                        }
                    };
                }

                function closeAuthModal() {
                    authModal.classList.remove('is-visible');
                }
            });
        </script>
        <?php
    }

}
