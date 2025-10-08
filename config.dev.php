<?php

class Brizy_Config
{

    const SITE_URL_PLACEHOLDER = '{@brizy_SITE_URL_PLACEHOLDER@}';
    const SITE_URL_PLACEHOLDER_REGEX = '/{@brizy_SITE_URL_PLACEHOLDER@}/im';
    const LOCAL_PAGE_ASSET_STATIC_URL = '/brizy/%s';
    const MEDIA_IMAGE_URL = '/media';
    const EDITOR_HELP_VIDEOS_URL = 'https://b-cloud.b-cdn.net/WordPress+Editor+Help+Videos';

    // this seems like it's not used any more. Leaving untouched
    const GATEWAY_URI = 'http://api.brizy.org';
    const CDN = 'http://bzassets.net/upload';

    const BRIZY_BLANK_TEMPLATE_FILE_NAME = 'brizy-blank-template.php';
    const BRIZY_TEMPLATE_FILE_NAME = 'brizy-header-footer-template.php';

    const BRIZY_APPLICATION_FORM_ID = '4_4sh251774pwkgswwcow4ssgkkgosk4wowgss00k8w0ggs8808o';
    const BRIZY_APPLICATION_FORM_NOTIFICATION_URL = 'http://cloud.bodnar.site/form/submit';
    const BRIZY_PLATFORM_MULTIPASS_LOGIN = '/multipass/login/%s/%s?email=%s';

    const PLATFORM_CLIENT_ID = "5_3nneq7brm50k4s4s4g0owk0088k8wco80cg4kc88o8wg0ks4w0";
    const PLATFORM_CLIENT_SECRET = "3dfj9r23uqgws0kws0cgsgs0008owcwo4o0o08sgs8o4wgco4";
    const PLATFORM_EMAIL = "admin@admin.com";

    const UPGRADE_TO_PRO_URL = "https://www.brizy.io/pricing-wordpress/?utm_source=wp-menu&utm_campaign=gopro&utm_medium=wp-dash/";
    const EDITOR_NEW_TEMPLEATES_URL = "https://phplaravel-1109775-4184176.cloudwaysapps.com/";
    const SUPPORT_URL = "https://support.brizy.io";
    const ABOUT_URL = "https://brizy.io";
    const TERMS_OF_SERVICE_URL = "https://www.brizy.io/terms-and-conditions";

    const EDITOR_BUILD_PATH = BRIZY_PLUGIN_PATH.DIRECTORY_SEPARATOR.'public'.DIRECTORY_SEPARATOR.'editor-build'.DIRECTORY_SEPARATOR.'dev';
    const EDITOR_BUILD_RELATIVE_PATH = 'public' . DIRECTORY_SEPARATOR . 'editor-build' . DIRECTORY_SEPARATOR . 'dev';
    const CLOUD_APP_KEY = 'YTVhMDEwMGUyNGE4OTQ5OWM2NTY3OGM3N2MxNzMzMTBjOWVlNTg0OGM0NWU1NGYzY2QxMGEzOWQ3NWNjMDk3Zg';
    const CLOUD_ENDPOINT = 'https://beta1.brizydemo.com';
    const CLOUD_EDITOR_VERSIONS = '/api/versions';
    const CLOUD_LIBRARY = '/dev/library';
    const CLOUD_SIGNIN = '/api/sign_ins';
    const CLOUD_SIGNUP = '/api/sign_ups';
    const CLOUD_RESET_PASSWORD = '/api/recover_passwords';
    const CLOUD_MEDIA = '/api/media';
    const CLOUD_CONTAINERS = '/api/containers';
    const CLOUD_PROJECTS = '/api/projects';
    const CLOUD_SAVEDBLOCKS = '/api/saved_blocks';
    const CLOUD_FONTS = '/api/fonts';
    const CLOUD_POPUPS = '/api/saved_popups';
    const CLOUD_LAYOUTS = '/api/layouts';
    const CLOUD_SCREENSHOT = '/screenshot/%s';
    const CLOUD_SCREENSHOTS = '/api/screenshots';
    const CLOUD_CUSTOM_FILES = '/api/custom_files';
    const GENERATE_GLOBAL_STYLES_ENDPOINT = 'https://ai.brizy.io';
    const AI_CREATE_SESSION_URL = 'http://172.17.0.1:8000/api/create-session';
    const AI_GENERATED_TEMPLATE_URL = 'http://172.17.0.1:8000/api/generated-template/';
    const AI_SET_PROJECT_DATA_URL = 'http://172.17.0.1:8000/api/set-project/1234-test';

    const WP_HTTP_TIMEOUT = 600;

    const LAYOUTS_CHUNK_URL = 'https://template-mk.b-cdn.net/api/get-layouts-chunk';
    const LAYOUTS_PAGES_URL = 'https://template-mk.b-cdn.net/api/get-layouts-pages';
    const LAYOUTS_PAGE_DATA_URL = 'https://template-mk.b-cdn.net/api/get-layouts-page';

    const BLOCKS_CHUNK_URL = "https://template-mk.b-cdn.net/api/get-kit-collections-chunk";
    const BLOCKS_KITS_URL = "https://template-mk.b-cdn.net/api/get-kits";
    const BLOCKS_DATA_URL = "https://template-mk.b-cdn.net/api/get-item";

    const POPUPS_CHUNK_URL = "https://template-mk.b-cdn.net/api/get-popups-chunk";
    const POPUPS_DATA_URL = "https://template-mk.b-cdn.net/api/get-popup-data";

    const STORIES_CHUNK_URL = "https://template-mk.b-cdn.net/api/get-story-chunk";
    const STORIES_PAGES_URL = "https://template-mk.b-cdn.net/api/get-story-page";
    const STORIES_DATA_URL = "https://template-mk.b-cdn.net/api/get-story-page-data";

    const TEMPLATES_IMAGE_URL = 'https://cloud-1de12d.b-cdn.net/media/iW=1024&iH=1024/';

    // this file will be stored in uploads/brizy/
    const PROJECT_STLYES_FILE_PATH = DIRECTORY_SEPARATOR.'project'.DIRECTORY_SEPARATOR.'styles.css';

    static public function getCompilerUrls()
    {
        $host = self::getEnvValue('COMPILER_HOST');

        return new Brizy_Admin_UrlIterator(
            array(
                "http://{$host}/compile/v4",
            )
        );
    }

    static public function getStaticUrls()
    {
        $host = self::getEnvValue('STATIC_HOST');

        return new Brizy_Admin_UrlIterator(
            array(
                "http://{$host}/static",
            )
        );
    }

    static public function getEditorBaseUrls()
    {
        return new Brizy_Admin_UrlIterator(
            array(
                'http://beta1.brizydemo.com',
            )
        );
    }

    static public function getFontsUrl()
    {
        $host = self::getEnvValue('EDITOR_HOST');

        return "http://{$host}/static";
    }

    static public function getCompilerDownloadUrl()
    {

        $host = self::getEnvValue('COMPILER_DOWNLOAD_HOST');

        return 'http://'.$host.'/wp-content/plugins/brizy/public/editor-build/dev';
    }

    static public function getSupportUrl()
    {
        return __bt('support-url', apply_filters('brizy_support_url', self::SUPPORT_URL));
    }

    static private function getEnvValue($name)
    {
        $value = isset($_ENV[$name]) ? $_ENV[$name] : null;
        $value = isset($_SERVER[$name]) ? $_SERVER[$name] : $value;

        return $value;
    }

    static public function getUpgradeUrl()
    {
        return apply_filters('brizy_upgrade_to_pro_url', self::UPGRADE_TO_PRO_URL);
    }

    static public function getEditorNewTemplatesUrl($directories)
    {
        return apply_filters('brizy_editor_config_templates_url', self::EDITOR_NEW_TEMPLEATES_URL.$directories);
    }

    static public function getTermsOfServiceUrl()
    {
        return apply_filters('brizy_config_terms_of_service_url', self::TERMS_OF_SERVICE_URL);
    }

    static public function getAiCreateSessionUrl()
    {
        return apply_filters('brizy_ai_create_session_url', self::AI_CREATE_SESSION_URL);
    }

    static public function getAiGeneratedTemplateUrl()
    {
        return apply_filters('brizy_ai_generated_template_url', self::AI_GENERATED_TEMPLATE_URL);
    }

    static public function getAiSetProjectDataUrl()
    {
        return apply_filters('brizy_ai_set_project_data_url', self::AI_SET_PROJECT_DATA_URL);
    }
}
