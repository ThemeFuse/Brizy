<?php 

if (!defined('ABSPATH')) {
    die('Direct access forbidden.');
}

class Brizy_Editor_AuthModal
{
    public function __construct()
    {
        add_action('wp_footer', [$this, 'authModal']);

        add_action('wp_ajax_' . Brizy_Editor::prefix() . '_login_handler', [$this, 'handleLogin']);
        add_action('wp_ajax_nopriv_' . Brizy_Editor::prefix() . '_login_handler', [$this, 'handleLogin']);
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
            (function() {
                var authModal = document.getElementById('brizy-auth-modal');
                var iframe = document.getElementById('brizy-auth-iframe');
                var ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>";
                var loginAction = "<?php echo Brizy_Editor::prefix(); ?>_login_handler";

                function closeAuthModal() {
                    if (authModal && authModal.classList.contains('is-visible')) {
                        authModal.classList.remove('is-visible');
                    }
                }

                function openAuthModal() {
                    if (!authModal || authModal.classList.contains('is-visible')) {
                        return;
                    }
                    authModal.classList.add('is-visible');
                    modalLoginHandler();
                }

                window.brizyOpenAuthModal = openAuthModal;
                window.brizyCloseAuthModal = closeAuthModal;
                
                function modalLoginHandler() {
                    iframe.src = "<?php echo wp_login_url('', true).'&interim-login=1'; ?>";
                    
                    iframe.onload = function() {
                        try {
                            var form = iframe.contentWindow.document.getElementById('loginform');
                            if (form && !form.getAttribute('data-handler')) {
                                form.addEventListener('submit', function(e) {
                                    e.preventDefault();

                                    var formData = new FormData(form);
                                    formData.append('action', loginAction);

                                    var xhr = new XMLHttpRequest();
                                    xhr.open('POST', ajaxurl, true);
                                    xhr.onload = function() {
                                        var response = JSON.parse(xhr.responseText);
                                        if (response.success) {
                                            updateHashInConfig();
                                            closeAuthModal();
                                        }
                                    };
                                    xhr.send(formData);
                                });
                                form.setAttribute('data-handler', '1');
                            }
                        } catch (e) {}
                    };
                }

                function updateHashInConfig() {
                    var config = window.__BRZ_PLUGIN_ENV__;
                    if (!config || !config.url || !config.actions || !config.actions.heartBeat) {
                        return;
                    }

                    var url = config.url;
                    var action = config.actions.heartBeat;
                    var version = config.editorVersion || 'dev';
                    var currentHash = config.hash || '';
                    var pageId = config.pageId || '';

                    var heartbeatUrl = url + '?action=' + action + '&version=' + version;
                    if (currentHash) {
                        heartbeatUrl += '&hash=' + currentHash;
                    }
                    if (pageId) {
                        heartbeatUrl += '&pageId=' + encodeURIComponent(pageId);
                    }

                    var xhr = new XMLHttpRequest();
                    xhr.open('GET', heartbeatUrl, true);
                    xhr.withCredentials = true;
                    xhr.onload = function() {
                        try {
                            var response = JSON.parse(xhr.responseText);
                            var data = response.data || response;
                            
                            if (data && typeof data === 'object' && 'hash' in data && typeof data.hash === 'string') {
                                var newHash = data.hash;
                                
                                if (window.__BRZ_PLUGIN_ENV__) {
                                    window.__BRZ_PLUGIN_ENV__.hash = newHash;
                                    
                                    if (window.__BRZ_PLUGIN_ENV__.actions) {
                                        window.__BRZ_PLUGIN_ENV__.actions.hash = newHash;
                                    }
                                }
                                
                                if (window.__VISUAL_CONFIG__) {
                                    if (!window.__VISUAL_CONFIG__.api) {
                                        window.__VISUAL_CONFIG__.api = {};
                                    }
                                    window.__VISUAL_CONFIG__.api.hash = newHash;
                                    
                                    if (window.__VISUAL_CONFIG__.wp && window.__VISUAL_CONFIG__.wp.api) {
                                        window.__VISUAL_CONFIG__.wp.api.hash = newHash;
                                    }
                                }
                            }
                            
                            if (data && typeof data === 'object' && 'pagePreview' in data && typeof data.pagePreview === 'string') {
                                if (window.__VISUAL_CONFIG__) {
                                    if (!window.__VISUAL_CONFIG__.urls) {
                                        window.__VISUAL_CONFIG__.urls = {};
                                    }
                                    window.__VISUAL_CONFIG__.urls.pagePreview = data.pagePreview;
                                }
                            }
                            
                            if (data && typeof data === 'object' && 'changeTemplate' in data && typeof data.changeTemplate === 'string') {
                                if (window.__VISUAL_CONFIG__) {
                                    if (!window.__VISUAL_CONFIG__.urls) {
                                        window.__VISUAL_CONFIG__.urls = {};
                                    }
                                    window.__VISUAL_CONFIG__.urls.changeTemplate = data.changeTemplate;
                                }
                            }
                        } catch (e) {
                            console.error('Error updating hash in config:', e);
                        }
                    };
                    xhr.onerror = function() {
                        console.error('Error sending heartbeat request');
                    };
                    xhr.send();
                }

            })();
        </script>

        <?php
    }

    public function handleLogin()
    {
        if (empty($_POST['log']) || empty($_POST['pwd'])) {
            wp_send_json_error();
            return;
        }

        $user = wp_signon([
            'user_login' => sanitize_user($_POST['log']),
            'user_password' => $_POST['pwd'],
            'remember' => isset($_POST['rememberme'])
        ], is_ssl());

        if (is_wp_error($user)) {
            wp_send_json_error();
            return;
        }

        wp_set_current_user($user->ID);
        wp_send_json_success();
    }
}