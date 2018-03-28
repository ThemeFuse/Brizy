<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Storage_PostSignature extends Brizy_Editor_Storage_Post {

	const BRIZY_POST_SIGNATURE_KEY = 'brizy-post-signature';

	protected function key() {
		return self::BRIZY_POST_SIGNATURE_KEY;
	}
}