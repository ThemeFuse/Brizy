<?php

/**
 * Created by PhpStorm.
 * User: alex
 * Date: 8/1/17
 * Time: 10:26 AM
 */
class Brizy_Config {

	const SITE_URL_PLACEHOLDER = '{@brizy_SITE_URL_PLACEHOLDER@}';
	const SITE_URL_PLACEHOLDER_REGEX = '/{@brizy_SITE_URL_PLACEHOLDER@}/im';
	const LOCAL_PAGE_MEDIA_STATIC_URL = '/brizy/media';
	const LOCAL_PAGE_ASSET_STATIC_URL = '/brizy/%s';
	const BRIZY_WP_EDITOR_ASSET_PATH = '/brizy/editor';
	const EDITOR_INTEGRATION_URL = 'http://integration.bitblox.site';
	const MEDIA_IMAGE_URL = '/storage/media';
	const EDITOR_ORIGIN_URL = 'http://brizy.org';

	const EDITOR_HOST_API = 'api.brizy.org';
	const EDITOR_HOST_BASE = 'www.brizy.org';
	const EDITOR_HOST_ORIGIN = 'brizy.org';
	const EDITOR_HOST_PRIMARY = 'brizy.org';

	const GATEWAY_URI = 'http://api.brizy.org';

	const BRIZY_REGISTRATION_CREDENTIALS = 'http://www.brizy.org/wordpress/credentials';

	const BRIZY_BLANK_TEMPLATE_FILE_NAME = 'brizy-blank-template.php';
	const BRIZY_TEMPLATE_FILE_NAME = 'brizy-template.php';

	const BRIZY_APPLICATION_INTEGRATION_URL = 'http://ec2-52-203-33-55.compute-1.amazonaws.com';
	const BRIZY_APPLICATION_FORM_ID = '4_4sh251774pwkgswwcow4ssgkkgosk4wowgss00k8w0ggs8808o';
	const BRIZY_APPLICATION_FORM_URL = 'http://www.brizy.org/client_id/%s?multipass_url=%s';
	const BRIZY_APPLICATION_FORM_NOTIFICATION_URL = 'http://cloud.bodnar.site/form/submit';
	const BRIZY_PLATFORM_MULTIPASS_LOGIN = '/multipass/login/%s/%s?email=%s';

	const PLATFORM_CLIENT_ID = "5_3nneq7brm50k4s4s4g0owk0088k8wco80cg4kc88o8wg0ks4w0";
	const PLATFORM_CLIENT_SECRET = "3dfj9r23uqgws0kws0cgsgs0008owcwo4o0o08sgs8o4wgco4";
	const PLATFORM_EMAIL = "admin@admin.com";

	const UPGRADE_TO_PRO_URL = "https://brizy.io/pro";

	static public function getCompilerUrls() {
		return new Brizy_Admin_UrlIterator(
			array(
				'http://editor:3000/wp-compile'
			)
		);
	}

	static public function getStaticBrizyUrls() {
		return new Brizy_Admin_UrlIterator(
			array(
				'http://bitblox.local/static'
			)
		);
	}

	static public function getEditorBaseUrls() {
		return new Brizy_Admin_UrlIterator(
			array( 'http://www.brizy.org' )
		);
	}
}