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

	const S3_ASSET_URL = 'http://bitblox.local/static';

	const LOCAL_PAGE_MEDIA_STATIC_URL = '/brizy/media';

	//const LOCAL_PAGE_ASSET_SPLITTER = "/\/brizy\/pages\/(.[^\/]*)\/(.[^\/]*)/";
	const LOCAL_PAGE_ASSET_STATIC_URL = '/brizy/pages/%s';
	//const BRIZY_WP_PAGE_ASSET_PATH = '/brizy/pages/%s/%s';


	//const LOCAL_EDITOR_ASSET_STATIC_URL = '/brizy/editor';
	//const LOCAL_EDITOR_ASSET_SPLITTER = "/\/brizy\/editor\/(.[^\/]*)\/(.[^\/]*)/";
	const BRIZY_WP_EDITOR_ASSET_PATH = '/brizy/editor';


	const EDITOR_BASE_URL = 'http://www.testblox.info';
	const EDITOR_INTEGRATION_URL = 'http://integration.bitblox.site';
	//const EDITOR_ASSETS_URL = "public/static";

	//const MEDIA_IMAGE_PATH = '/storage/media';
	const MEDIA_IMAGE_URL = 'https://app.brizy.io/storage/media';
	const MEDIA_IMAGE_URL_REGEX = 'https:\/\/app\.brizy\.io\/storage\/media.[^"\'\s)]+';

	const EDITOR_ORIGIN_URL = 'http://testblox.info';

	const EDITOR_HOST_API = 'api.testblox.info';
	const EDITOR_HOST_BASE = 'www.testblox.info';
	const EDITOR_HOST_ORIGIN = 'testblox.info';
	const EDITOR_HOST_PRIMARY = 'testblox.info';

	const GATEWAY_URI = 'http://api.testblox.info';
	const COMPILER_URI = 'http://editor:3000/wp-compile';

	const BRIZY_REGISTRATION_CREDENTIALS = 'http://www.testblox.info/wordpress/credentials';

	const BRIZY_TEMPLATE_FILE_NAME = 'brizy-blank-template.php';

	const BRIZY_APPLICATION_INTEGRATION_URL = 'http://ec2-52-203-33-55.compute-1.amazonaws.com';
	const BRIZY_APPLICATION_FORM_ID = '4_4sh251774pwkgswwcow4ssgkkgosk4wowgss00k8w0ggs8808o';
	const BRIZY_APPLICATION_FORM_URL = 'http://www.testblox.info/client_id/%s?multipass_url=%s';
	const BRIZY_APPLICATION_FORM_NOTIFICATION_URL = 'http://www.testblox.info/form/submit';
	const BRIZY_PLATFORM_MULTIPASS_LOGIN = 'http://www.testblox.info/multipass/login/%s/%s?email=%s';

	const PLATFORM_CLIENT_ID = "5_3nneq7brm50k4s4s4g0owk0088k8wco80cg4kc88o8wg0ks4w0";
	const PLATFORM_CLIENT_SECRET = "3dfj9r23uqgws0kws0cgsgs0008owcwo4o0o08sgs8o4wgco4";
	const PLATFORM_EMAIL = "admin@admin.com";
}