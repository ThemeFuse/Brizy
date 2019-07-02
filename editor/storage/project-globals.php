<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Storage_ProjectGlobals extends Brizy_Editor_Storage_Project {

	const META_KEY = 'brizy-project-globals';

	protected function key() {
		return self::META_KEY;
	}

	/**
	 * @param $id
	 *
	 * @return Brizy_Editor_Storage_Post
	 */
	public static function instance( $id ) {
		return new self( $id );
	}
}