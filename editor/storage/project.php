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

	/**
	 * @return array
	 * @throws Exception
	 */
	public function get_storage() {

		$project = parent::get_storage();

		if ( ! empty( $project ) ) {
			return $project;
		}

		$metadata = get_metadata( 'post', $this->get_id() );

		if ( ! isset( $metadata[ $this->key() ] ) ) {
			return [];
		}

		foreach ( $metadata[ $this->key() ] as $data ) {

			$fixedData = preg_replace( "/O:(\d+):\"Brizy_(.+?)\"/u", "C:$1:\"Brizy_$2\"", $data );

			if ( $fixedData ) {
				$unserializedData = maybe_unserialize( $fixedData );

				if ( $unserializedData ) {

					$storage = self::instance( $this->get_id() );
					$storage->loadStorage( $unserializedData );

					return $unserializedData;
				}
			}
		}

		return [];
	}
}