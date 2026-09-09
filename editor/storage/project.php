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

	/**
	 * Last resort guard. See BRZ-693.
	 *
	 * This deliberately still throws. The project is repaired when it is loaded,
	 * by Brizy_Editor_ProjectHealer, so in practice nothing should ever reach this
	 * branch any more. If something does, it means an in memory project object
	 * lost its data after it was loaded, and quietly substituting the editor
	 * defaults here would overwrite a database row that may still hold the real
	 * pages. Refusing the write is the only behaviour that cannot lose data.
	 *
	 * @param array $value
	 *
	 * @throws Exception
	 */
	public function loadStorage( $value ) {

		if ( ! Brizy_Editor_ProjectHealer::isHealthy( $value ) ) {
			// The project record carries the license key and the cloud token, so
			// the value itself must never be dumped into the log table.
			Brizy_Logger::instance()->critical(
				'Execution stopped. Attempt to save invalid project data.',
				Brizy_Editor_ProjectHealer::describe( $this->get_id(), $value )
			);
			throw new Exception( 'Execution stopped. Attempt to save invalid project data.' );
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

			$project = $this->tryToFixSerializer( $data );

			if ( $project ) {
				return $project;
			}
		}

		return [];
	}

	/**
	 * @throws Exception
	 */
	private function tryToFixSerializer( $data ) {
		$project = $this->tryToUnserialize( preg_replace( "/O:(\d+):\"Brizy_(.+?)\"/u", "C:$1:\"Brizy_$2\"", $data ) );

		if ( $project ) {
			return $project;
		}

		$data = preg_replace_callback(
			'/(?<=^|\{|;)s:(\d+):\"(.*?)\";(?=[asbdiO]\:\d|N;|\}|$)/s',
			function ( $m ) {
				return 's:' . strlen( $m[2] ) . ':"' . $m[2] . '";';
			},
			$data
		);

		return $this->tryToUnserialize( $data );
	}

	/**
	 * @throws Exception
	 */
	private function tryToUnserialize( $strSerialized ) {

		if ( ! $strSerialized ) {
			return [];
		}

		$unserializedData = maybe_unserialize( $strSerialized );

		if ( ! is_array( $unserializedData ) || ! $unserializedData ) {
			return [];
		}

		// BRZ-693. Persist the repaired serialization only when the value that came
		// back out of it can actually be saved. A recovered but empty project used
		// to make this read path call loadStorage() and blow up with
		// "Attempt to save invalid project data" even though nobody asked to save
		// anything. It now reaches the caller instead, where the healer can deal
		// with it.
		if ( Brizy_Editor_ProjectHealer::isHealthy( $unserializedData ) ) {
			self::instance( $this->get_id() )->loadStorage( $unserializedData );
		}

		return $unserializedData;
	}
}