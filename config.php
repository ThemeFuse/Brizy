<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 8/1/17
 * Time: 10:26 AM
 */

class Brizy_Config {

	const EDITOR_PRIMARY_URL = 'http://api.brizy.io';
	const COMPILER_URL = 'http://api.brizy.io';
	const EDITOR_STATIC_URL = BRIZY_DEBUG?'http://bitblox.local/static':'http://api.brizy.io/static';

	const BRIZY_WP_ASSET_PATH = 'uploads/brizy/pages/%s/';

	const LOCAL_PAGE_ASSET_STATIC_URL = '/wp-content/uploads/brizy/pages';
	const BRIZY_WP_PAGE_ASSET_PATH = 'wp-content/uploads/brizy/pages/%s';

	const LOCAL_EDITOR_ASSET_STATIC_URL = '/wp-content/uploads/brizy/editor';
	const BRIZY_WP_EDITOR_ASSET_PATH = '/wp-content/uploads/brizy/editor/%s';

	const BRIZY_S3_ASSET_URL = BRIZY_DEBUG?'http://bitblox.local/static':'https://s3.amazonaws.com/bitblox-test/%s/%s';

	const ASSETS_PATTERN = '/(https?:\/\/bitblox.local\/assets\/[a-z|0-9|\/|\*|\.]+\.[png|gif|bmp|jpg|jpeg]+)/i';

	const EDITOR_BASE_URL = 'http://www.testblox.info';
	const EDITOR_INTEGRATION_URL = 'http://integration.bitblox.site';
	const EDITOR_IMAGE_URL = 'http://static.bitblox.xyz/storage/media';
	const EDITOR_ORIGIN_URL = 'http://testblox.info';

	const EDITOR_HOST_API = 'api.testblox.info';
	const EDITOR_HOST_BASE = 'www.testblox.info';
	const EDITOR_HOST_ORIGIN = 'testblox.info';
	const EDITOR_HOST_PRIMARY = 'testblox.info';

	const GATEWAY_URI = 'http://api.brizy.io';

	const BRIZY_ID = '1_19e6979gnz40s84w48gs8sgk0sgw488ows80okoww0cw4oc0co';
	const BRIZY_KEY = '3jqp89myle4goo4sg88w0ccw4s4kgw8ckkkko0sgkg0osc8s0c';
	const BRIZY_EMAIL = 'admin@admin.com';
	const BRIZY_PASSWORD = 'admin';
}



