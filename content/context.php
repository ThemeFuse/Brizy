<?php

use BrizyPlaceholders\ContextInterface;

class Brizy_Content_Context implements ContextInterface {

	private $data = array();

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

    public function afterExtract($contentPlaceholders, $instancePlaceholders, $contentAfterExtractor) {
        $this->setPlaceholders($contentPlaceholders);
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

	/**
	 * BrizyPro_Content_Context constructor.
	 *
	 * @param $project
	 * @param $wp_post
	 */
	public function __construct( $project, $brizy_post, $wp_post, $contentHtml ) {
		$this->setProject( $project );
		$this->setWpPost( $wp_post );
	}
}