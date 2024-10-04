<?php


class Brizy_Config
{

    const SITE_URL_PLACEHOLDER = '{@brizy_SITE_URL_PLACEHOLDER@}';
    const SITE_URL_PLACEHOLDER_REGEX = '/{@brizy_SITE_URL_PLACEHOLDER@}/im';
    const LOCAL_PAGE_ASSET_STATIC_URL = '/brizy/%s';
    const MEDIA_IMAGE_URL = '/media';
    const EDITOR_HELP_VIDEOS_URL = 'https://b-cloud.b-cdn.net/WordPress+Editor+Help+Videos';

    // this seems like it's not used any more. Leaving untouched
    const GATEWAY_URI = 'https://api.brizy.io';
    const CDN = 'http://bzassets.net/upload';

    const BRIZY_BLANK_TEMPLATE_FILE_NAME = 'brizy-blank-template.php';
    const BRIZY_TEMPLATE_FILE_NAME = 'brizy-header-footer-template.php';

    const BRIZY_APPLICATION_FORM_ID = '6_5968m8wd3r8kcwww8o480w4c4c84sc8gw4kwk80s4k0c48ogkc';
    const BRIZY_APPLICATION_FORM_NOTIFICATION_URL = 'http://cloud.bodnar.site/form/submit';
    const BRIZY_PLATFORM_MULTIPASS_LOGIN = '/multipass/login/%s/%s?email=%s';

    const PLATFORM_CLIENT_ID = "2_5to57xuihv48c4s400sk0wgwcw0gg4s4ggwccos4g4c4444occ";
    const PLATFORM_CLIENT_SECRET = "3kfsu3y91csg08oskg8kowg4844go0o88sow48c00wwsgwk00s";
    const PLATFORM_EMAIL = "admin@admin.com";

    const UPGRADE_TO_PRO_URL = "https://www.brizy.io/pricing/?utm_source=wp-menu&utm_campaign=gopro&utm_medium=wp-dash/";
    const SUPPORT_URL = "https://support.brizy.io";
    const ABOUT_URL = "https://www.brizy.io";
    const TERMS_OF_SERVICE_URL = "https://www.brizy.io/terms-and-conditions";
    const EDITOR_BUILD_PATH = BRIZY_PLUGIN_PATH.DIRECTORY_SEPARATOR.'public'.DIRECTORY_SEPARATOR.'editor-build'.DIRECTORY_SEPARATOR.'prod';
    const EDITOR_BUILD_RELATIVE_PATH = 'public/editor-build/prod';

    const CLOUD_APP_KEY = 'YTVhMDEwMGUyNGE4OTQ5OWM2NTY3OGM3N2MxNzMzMTBjOWVlNTg0OGM0NWU1NGYzY2QxMGEzOWQ3NWNjMDk3Zg';
    const CLOUD_ENDPOINT = 'https://admin.brizy.io';
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
    const WP_HTTP_TIMEOUT = 30;

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
    const PROJECT_STLYES_FILE_PATH = '/project/styles.css';

    static public function getCompilerUrls()
    {
        return new Brizy_Admin_UrlIterator(
            array(
                'http://compiler.brizy.io/compile/v4',
                'http://compiler1.brizycompiler.run/compile/v4',
                'http://compiler2.brizycompiler.run/compile/v4',
            )
        );
    }

    static public function getStaticUrls()
    {
        return new Brizy_Admin_UrlIterator(
            array(
                'https://static.brizy.io/builds/free/%s',
                'http://static1.brizycompiler.run/builds/free/%s',
                'http://static2.brizycompiler.run/builds/free/%s',
            )
        );
    }

    static public function getEditorBaseUrls()
    {
        return new Brizy_Admin_UrlIterator(
            array(
                'https://admin.brizy.io',
                'http://media1.brizycompiler.run',
                'http://media2.brizycompiler.run',
            )
        );
    }

    static public function getFontsUrl()
    {
        return "https://admin.brizy.io/fonts/wp?path=%s";
    }

    static public function getCompilerDownloadUrl()
    {
        return 'https://static.brizy.io/builds/free/'.BRIZY_EDITOR_VERSION;
    }

    static public function getSupportUrl()
    {
        return __bt('support-url', apply_filters('brizy_support_url', self::SUPPORT_URL));
    }

    static public function getUpgradeUrl()
    {
        return apply_filters('brizy_upgrade_to_pro_url', self::UPGRADE_TO_PRO_URL);
    }

    static public function getTermsOfServiceUrl()
    {
        return apply_filters('brizy_config_terms_of_service_url', self::TERMS_OF_SERVICE_URL);
    }
}
