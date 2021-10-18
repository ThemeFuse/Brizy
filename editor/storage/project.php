<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_Storage_Project extends Brizy_Editor_Storage_Post {

	const META_KEY = 'brizy-project';

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

	public function loadStorage( $value ) {

		if(!isset($value['data']) || is_null($value['data']) || empty($value['data'])) {
			Brizy_Logger::instance()->critical( 'Execution stopped. Attempt to save invalid project data.', array( $value ) );
			throw new Exception('Execution stopped. Attempt to save invalid project data.');
		}
		parent::loadStorage( $value );
	}
}