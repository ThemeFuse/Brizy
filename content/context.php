<?php

use BrizyPlaceholders\ContextInterface;

class Brizy_Content_Context implements ContextInterface {

	protected $data = array();

	/**
	 * @var Brizy_Content_ContentPlaceholder[]
	 */
	protected $placeholders = [];


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

	/**
	 * BrizyPro_Content_Context constructor.
	 *
	 * @param $project
	 * @param $wp_post
	 */
	public function __construct( $project, $brizy_post, $wp_post, $contentHtml, $parentContenxt = null ) {
		$this->setProject( $project );
		$this->setWpPost( $wp_post );
		$this->setParentContext( $parentContenxt );
	}

	/**
	 * @return array
	 */
	public function getPlaceholders(): array {
		return $this->placeholders;
	}

	/**
	 * @param array $placeholders
	 *
	 * @return Brizy_Content_Context
	 */
	public function setPlaceholders( array $placeholders ): Brizy_Content_Context {
		$this->placeholders = $placeholders;

		return $this;
	}

	/**
	 * @param $id
	 *
	 * @return Brizy_Content_ContentPlaceholder|null
	 */
	public function getPlaceholderById( $id ) {

		$results = $this->getPlaceholdersByAttrValue( 'id', $id );

		return isset( $results[0] ) ? $results[0] : null;
	}

	/**
	 * @param $key
	 * @param $value
	 *
	 * @return Brizy_Content_ContentPlaceholder|null
	 * @throws Exception
	 */
	public function getPlaceholdersByAttrValue( $key, $value ) {

		$results = [];
		if ( isset( $this->placeholders ) ) {
			foreach ( $this->placeholders as $placeholder ) {
				if ( $placeholder->getAttr( $key ) === $value ) {
					$results[] = $placeholder;
				}
			}
		}

		return $results;
	}

    /**
     * @param $attributes
     * @return Brizy_Content_ContentPlaceholder|null
     */
    public function getPlaceholderByAttrValues( $attributes ) {

        if ( isset( $this->placeholders ) ) {
            foreach ( $this->placeholders as $placeholder ) {
                if ( count(array_intersect($placeholder->getAttributes(),$attributes))==count($attributes) ) {
                    return $placeholder;
                }
            }
        }

        return null;
    }
}
