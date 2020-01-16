<?php


class Brizy_Config {

	const SITE_URL_PLACEHOLDER = '{@brizy_SITE_URL_PLACEHOLDER@}';
	const SITE_URL_PLACEHOLDER_REGEX = '/{@brizy_SITE_URL_PLACEHOLDER@}/im';
	const LOCAL_PAGE_ASSET_STATIC_URL = '/brizy/%s';
	const MEDIA_IMAGE_URL = '/media';
	const FONTS_URL = 'https://www.brizy.cloud/fonts/wp?path=%s';

	// this seems like it's not used any more. Leaving untouched
	const GATEWAY_URI = 'https://api.brizy.io';

	const BRIZY_BLANK_TEMPLATE_FILE_NAME = 'brizy-blank-template.php';
	const BRIZY_TEMPLATE_FILE_NAME = 'brizy-header-footer-template.php';

	const BRIZY_APPLICATION_FORM_ID = '6_5968m8wd3r8kcwww8o480w4c4c84sc8gw4kwk80s4k0c48ogkc';
	const BRIZY_APPLICATION_FORM_NOTIFICATION_URL = 'http://cloud.bodnar.site/form/submit';
	const BRIZY_PLATFORM_MULTIPASS_LOGIN = '/multipass/login/%s/%s?email=%s';

	const PLATFORM_CLIENT_ID = "2_5to57xuihv48c4s400sk0wgwcw0gg4s4ggwccos4g4c4444occ";
	const PLATFORM_CLIENT_SECRET = "3kfsu3y91csg08oskg8kowg4844go0o88sow48c00wwsgwk00s";
	const PLATFORM_EMAIL = "admin@admin.com";

	const UPGRADE_TO_PRO_URL = "https://www.brizy.io/brizy-pro-pricing/";
	const SUPPORT_URL = "https://support.brizy.io";
	const ABOUT_URL = "https://www.brizy.io";
	const GO_PRO_DASHBOARD_URL = "https://www.brizy.io/brizy-pro-pricing/?utm_source=wp-menu&utm_campaign=gopro&utm_medium=wp-dash/";

	const EDITOR_BUILD_PATH = BRIZY_PLUGIN_PATH . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'editor-build' . DIRECTORY_SEPARATOR . BRIZY_EDITOR_VERSION;
	const EDITOR_BUILD_URL = BRIZY_PLUGIN_URL . '/public/editor-build/'.BRIZY_EDITOR_VERSION;

	static public function getCompilerUrls() {
		return new Brizy_Admin_UrlIterator(
			array(
				'http://compiler.brizy.io/compile/v2',
				'http://compiler1.brizycompiler.run/compile/v2',
				'http://compiler2.brizycompiler.run/compile/v2'
			)
		);
	}

	static public function getStaticUrls() {
		return new Brizy_Admin_UrlIterator(
			array(
				'https://static.brizy.io/builds/free/%s',
				'http://static1.brizycompiler.run/builds/free/%s',
				'http://static2.brizycompiler.run/builds/free/%s'
			)
		);
	}

	static public function getEditorBaseUrls() {
		return new Brizy_Admin_UrlIterator(
			array(
				'https://www.brizy.cloud',
				'http://media1.brizycompiler.run',
				'http://media2.brizycompiler.run'
			)
		);
	}

	static public function getOptimizerConfig( $className ) {
		switch ( $className ) {
			case 'Brizy_Editor_Asset_Optimize_ShortpixelOptimizer':
				return array( 'API_KEY' => 'uunlmNjZZBtKLfCSg4OK' );
		}
	}

}