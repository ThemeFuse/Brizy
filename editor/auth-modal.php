<?php 

if (!defined('ABSPATH')) {
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
        echo $this->renderModalHtml(false);
    }

    /**
     * HTML for auth modal. In editor wrapper page use getModalHtmlForEditorWrapper() and echo in view — no public hook.
     *
     * @param bool $in_parent true = modal in parent (editor page), config from iframe
     * @return string
     */
    public function getModalHtmlForEditorWrapper()
    {
        return $this->renderModalHtml(true);
    }

    private function renderModalHtml($in_parent)
    {
        ob_start();
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
                z-index: <?php echo $in_parent ? '2147483647' : '99999'; ?>;
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
                var _w = <?php echo $in_parent ? "document.getElementById('brz-ed-iframe')&&document.getElementById('brz-ed-iframe').contentWindow" : "window"; ?>;

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
                                form.setAttribute('data-handler', '1');
                            } else {
                                try {
                                    var body = iframe.contentWindow.document.body;
                                    if (body && body.innerHTML.indexOf('logged in successfully') !== -1) {
                                        updateHashInConfig(function() {
                                            closeAuthModal();
                                        });
                                    }
                                } catch (e) {
                                    updateHashInConfig(function() {
                                        closeAuthModal();
                                    });
                                }
                            }
                        } catch (e) {}
                    };
                }

                function updateHashInConfig(callback) {
                    var config = _w && _w.__BRZ_PLUGIN_ENV__;
                    if (!config || !config.url || !config.actions || !config.actions.heartBeat) {
                        if (callback) callback();
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
                                
                                if (_w && _w.__BRZ_PLUGIN_ENV__) {
                                    _w.__BRZ_PLUGIN_ENV__.hash = newHash;
                                    if (_w.__BRZ_PLUGIN_ENV__.actions) _w.__BRZ_PLUGIN_ENV__.actions.hash = newHash;

                                    if (_w.__BRZ_PLUGIN_ENV__.api && _w.__BRZ_PLUGIN_ENV__.api.customIcon) {
                                        var c = _w.__BRZ_PLUGIN_ENV__.api.customIcon;
                                        try {
                                            var setHashInUrl = function(url, h) {
                                                if (!url || typeof url !== 'string') return url;
                                                try {
                                                    var u = new URL(url, _w.location.origin);
                                                    u.searchParams.set('hash', h);
                                                    return u.toString();
                                                } catch (e) { return url; }
                                            };
                                            if (c.getIconsUrl) c.getIconsUrl = setHashInUrl(c.getIconsUrl, newHash);
                                            if (c.uploadIconUrl) c.uploadIconUrl = setHashInUrl(c.uploadIconUrl, newHash);
                                            if (c.deleteIconUrl) c.deleteIconUrl = setHashInUrl(c.deleteIconUrl, newHash);
                                        } catch (e) { /* ignore */ }
                                    }

                                }
                                if (_w && _w.__VISUAL_CONFIG__) {
                                    if (!_w.__VISUAL_CONFIG__.api) _w.__VISUAL_CONFIG__.api = {};
                                    _w.__VISUAL_CONFIG__.api.hash = newHash;
                                    if (_w.__VISUAL_CONFIG__.wp && _w.__VISUAL_CONFIG__.wp.api) _w.__VISUAL_CONFIG__.wp.api.hash = newHash;
                                }
                            }
                            
                            if (data && typeof data === 'object' && 'pagePreview' in data && typeof data.pagePreview === 'string') {
                                if (_w && _w.__VISUAL_CONFIG__) {
                                    if (!_w.__VISUAL_CONFIG__.urls) _w.__VISUAL_CONFIG__.urls = {};
                                    _w.__VISUAL_CONFIG__.urls.pagePreview = data.pagePreview;
                                }
                            }
                            if (data && typeof data === 'object' && 'changeTemplate' in data && typeof data.changeTemplate === 'string') {
                                if (_w && _w.__VISUAL_CONFIG__) {
                                    if (!_w.__VISUAL_CONFIG__.urls) _w.__VISUAL_CONFIG__.urls = {};
                                    _w.__VISUAL_CONFIG__.urls.changeTemplate = data.changeTemplate;
                                }
                            }
                            
                            if (callback) callback();
                        } catch (e) {
                            console.error('Error updating hash in config:', e);
                            if (callback) callback();
                        }
                    };
                    xhr.onerror = function() {
                        console.error('Error sending heartbeat request');
                        if (callback) callback();
                    };
                    xhr.send();
                }

            })();
        </script>

        <?php
        return ob_get_clean();
    }
}