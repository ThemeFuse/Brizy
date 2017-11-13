<?php
/**
 * Created by PhpStorm.
 * User: alex
 * Date: 8/1/17
 * Time: 10:26 AM
 */

class Brizy_Config {

	const EDITOR_PRIMARY_URL = 'http://bitblox.local';
	const EDITOR_STATIC_URL = 'http://bitblox.local/static';
	const ASSET_STATIC_URL = 'http://brizy.local/brizy-proxy';
	const COMPILER_URL = 'http://api.bitblox.xyz';
	const BRIZY_WP_ASSET_PATH = 'uploads/brizy/pages/%s/';

	const ASSETS_PATTERN = '/(https?:\/\/bitblox.local\/assets\/[a-z|0-9|\/|\*|\.]+\.[png|gif|bmp|jpg|jpeg]+)/i';

	const EDITOR_BASE_URL = 'http://www.testblox.info';
	const EDITOR_INTEGRATION_URL = 'http://integration.bitblox.site';
	const EDITOR_IMAGE_URL = 'http://static.bitblox.xyz/storage/media';
	const EDITOR_ORIGIN_URL = 'http://testblox.info';

	const EDITOR_HOST_API = 'api.testblox.info';
	const EDITOR_HOST_BASE = 'www.testblox.info';
	const EDITOR_HOST_ORIGIN = 'testblox.info';
	const EDITOR_HOST_PRIMARY = 'testblox.info';

	const GATEWAY_URI = 'http://api.bitblox.xyz';

	const BRIZY_ID = '69_1oecueu4a5s04k48wgwkok4s84cwwcsc488o44kss8c4s44wkg';
	const BRIZY_KEY = '7neyrf2rm000s0sooc4ok4kk4sk8k0o0w08ksooww0cgok4kc';
	const BRIZY_EMAIL = 'admin@admin.com';

	// we will not use password grant_type.. so we will delete this very soon :)
	const BRIZY_PASSWORD = 'admin';



}