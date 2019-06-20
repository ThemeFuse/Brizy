<?php


trait Brizy_Editor_DynamicPropertyAware {
	protected $data = array();

	/**
	 * @param $name
	 * @param $arguments
	 *
	 * @return mixed|null
	 */
	public function __call( $name, $arguments ) {
		$method = substr( $name, 0, 3 );
		$key    = substr( $name, 3 );

		switch ( $method ) {
			case 'set':
				return $this->set( $key, $arguments[0] );
				break;
			case 'get':
				return $this->get( $key );
				break;
		}
	}


	/**
	 * @param $name
	 *
	 * @return null|mixed
	 */
	protected function get( $name ) {

		if ( is_null( $name ) ) {
			return;
		}

		if ( isset( $this->data[ $name ] ) ) {
			return $this->data[ $name ];
		}

		return null;
	}

	/**
	 * @param $key
	 * @param $value
	 *
	 * @return null|mixed
	 */
	protected function set( $key, $value ) {
		if ( is_null( $value ) ) {
			return null;
		}

		return $this->data[ $key ] = $value;
	}
}