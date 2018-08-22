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
	//const EDITOR_PRIMARY_URL = 'https://api.brizy.io';

	const S3_ASSET_URL = 'https://static.brizy.io/%s/%s';

	const LOCAL_PAGE_MEDIA_STATIC_URL = '/brizy/media';

	//const LOCAL_PAGE_ASSET_SPLITTER = "/\/brizy\/pages\/(.[^\/]*)\/(.[^\/]*)/";
	const LOCAL_PAGE_ASSET_STATIC_URL = '/brizy/%s';
	//const BRIZY_WP_PAGE_ASSET_PATH = '/brizy/pages/%s/%s';


	//const LOCAL_EDITOR_ASSET_STATIC_URL = '/brizy/editor';
	//const LOCAL_EDITOR_ASSET_SPLITTER = "/\/brizy\/editor\/(.[^\/]*)\/(.[^\/]*)/";
	const BRIZY_WP_EDITOR_ASSET_PATH = '/brizy/editor';


	const EDITOR_BASE_URL = 'https://app.brizy.io';
	const EDITOR_INTEGRATION_URL = 'http://integration.bitblox.site';
	//const EDITOR_ASSETS_URL = "public/static";

	//const MEDIA_IMAGE_PATH = '/storage/media';
	const MEDIA_IMAGE_URL = 'https://app.brizy.io/storage/media';
	const MEDIA_IMAGE_URL_REGEX = 'https:\/\/app\.brizy\.io\/storage\/media.[^"\'\s,)]+';

	const EDITOR_ORIGIN_URL = 'http://testblox.info';
	const EDITOR_HOST_API = 'api.testblox.info';
	const EDITOR_HOST_BASE = 'www.testblox.info';
	const EDITOR_HOST_ORIGIN = 'testblox.info';
	const EDITOR_HOST_PRIMARY = 'testblox.info';

	const GATEWAY_URI = 'https://api.brizy.io';
	const COMPILER_URI = 'http://editorcomplier-lb-1472504860.us-east-1.elb.amazonaws.com/compile';

	const BRIZY_REGISTRATION_CREDENTIALS = 'https://app.brizy.io/wordpress/credentials';

	const BRIZY_BLANK_TEMPLATE_FILE_NAME = 'brizy-blank-template.php';
	const BRIZY_TEMPLATE_FILE_NAME = 'brizy-template.php';

	const BRIZY_APPLICATION_INTEGRATION_URL = 'https://integrations.brizy.io';
	const BRIZY_APPLICATION_FORM_ID = '6_5968m8wd3r8kcwww8o480w4c4c84sc8gw4kwk80s4k0c48ogkc';
	const BRIZY_APPLICATION_FORM_URL = 'https://app.brizy.io/client_id/%s?multipass_url=%s';
	const BRIZY_APPLICATION_FORM_NOTIFICATION_URL = 'https://app.brizy.io/form/submit';
	const BRIZY_PLATFORM_MULTIPASS_LOGIN = 'https://app.brizy.io/multipass/login/%s/%s?email=%s';

	const PLATFORM_CLIENT_ID = "2_5to57xuihv48c4s400sk0wgwcw0gg4s4ggwccos4g4c4444occ";
	const PLATFORM_CLIENT_SECRET = "3kfsu3y91csg08oskg8kowg4844go0o88sow48c00wwsgwk00s";
	const PLATFORM_EMAIL = "admin@admin.com";

}