<?php

class Brizy_Config {

	const SITE_URL_PLACEHOLDER = '{@brizy_SITE_URL_PLACEHOLDER@}';
	const SITE_URL_PLACEHOLDER_REGEX = '/{@brizy_SITE_URL_PLACEHOLDER@}/im';
	const LOCAL_PAGE_ASSET_STATIC_URL = '/brizy/%s';
	const MEDIA_IMAGE_URL = '/media';

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

	const UPGRADE_TO_PRO_URL = "https://www.brizy.io/brizy-pro-pricing/";
	const SUPPORT_URL = "https://support.brizy.io";
	const ABOUT_URL = "https://brizy.io";
	const GO_PRO_DASHBOARD_URL = "https://www.brizy.io/brizy-pro-pricing/?utm_source=wp-menu&utm_campaign=gopro&utm_medium=wp-dash/";
	const EDITOR_BUILD_PATH = BRIZY_PLUGIN_PATH . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'editor-build' . DIRECTORY_SEPARATOR . 'dev';
	const EDITOR_BUILD_RELATIVE_PATH = 'public/editor-build/dev';

	const CLOUD_APP_KEY = 'YTVhMDEwMGUyNGE4OTQ5OWM2NTY3OGM3N2MxNzMzMTBjOWVlNTg0OGM0NWU1NGYzY2QxMGEzOWQ3NWNjMDk3Zg';
	const CLOUD_ENDPOINT = 'http://www.brizysites.com';
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
	const WP_HTTP_TIMEOUT = 600;

	static public function getCompilerUrls() {
		$host = $_ENV['COMPILER_HOST'] ?? $_SERVER['COMPILER_HOST'];
		return new Brizy_Admin_UrlIterator(
			array(
				"http://{$host}/compile/v3"
			)
		);
	}

	static public function getStaticUrls() {
		$host = $_ENV['STATIC_HOST'] ?? $_SERVER['STATIC_HOST'];

		return new Brizy_Admin_UrlIterator(
			array(
				"http://{$host}/static"
			)
		);
	}

	static public function getEditorBaseUrls() {
		return new Brizy_Admin_UrlIterator(
			array(
				'http://www.brizysites.com'
			)
		);
	}

	static public function getFontsUrl() {
		$host = $_ENV['EDITOR_HOST'] ?? $_SERVER['EDITOR_HOST'];
		return  "http://{$host}/static";
	}

	static public function getCompilerDownloadUrl() {
		$host = $_ENV['COMPILER_DOWNLOAD_HOST'] ?? $_SERVER['COMPILER_DOWNLOAD_HOST'];
		return  'http://'.$host.'/wp-content/plugins/brizy/public/editor-build/dev';
	}

	static public function getSupportUrl() {
		return __bt( 'support-url', apply_filters( 'brizy_support_url', self::SUPPORT_URL ) );
	}
}
