<?php

use BrizyPlaceholders\ContextInterface;

class Brizy_Content_Context implements ContextInterface {

	private $data = array();
	private $parentContext = null;

	/**
	 * @param $name
	 * @param $arguments
	 *
	 * @return mixed|null
	 */
	public function __call( $name, $arguments ) {
		$method = substr( $name, 0, 12 );
		$key = substr( $name, 12 );
		if ( $method !== 'getRecursive' ) {
			$method = substr( $name, 0, 3 );
			$key = substr( $name, 3 );
		}


		switch ( $method ) {
			case 'set':
				return $this->set( $key, $arguments[0] );
			case 'get':
				return $this->get( $key );
			case 'getRecursive':
				return $this->get( $key, true );
		}
	}


	/**
	 * @param $name
	 *
	 * @return null|mixed
	 */
	protected function get( $name, $recursive = false ) {

		if ( is_null( $name ) ) {
			return;
		}
		if ( isset( $this->data[ $name ] ) ) {
			return $this->data[ $name ];
		}
		if ( $recursive && $this->parentContext instanceof ContextInterface ) {
			return $this->parentContext->get( $name, true );
		}

		return null;
	}

	public function afterExtract( $contentPlaceholders, $instancePlaceholders, $contentAfterExtractor ) {
		$this->setPlaceholders( array_merge( (array) $this->getPlaceholders(), $contentPlaceholders ) );
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
	public function __construct( $project = null, $wp_post = null, $parentContext = null, $parentPlaceholder = null ) {
		$this->setProject( $project );
		$this->setWpPost( $wp_post );
		$this->setEntity( $wp_post );
		$this->setParentPlaceholder( $parentPlaceholder );
		if ( $parentContext instanceof ContextInterface ) {
			$this->parentContext = ( $parentContext );
		}
	}

	public function getParentContext() {
		return $this->parentContext;
	}

	public function setParentContext( $parentContext ) {
		$this->parentContext = $parentContext;

		return $this;
	}

	public function searchPlaceholderByNameAndAttr( $name, $attrName, $attrValue ) {
		foreach ( (array) $this->getPlaceholders() as $placeholder ) {
			if ( $placeholder->getName() == $name && $placeholder->getAttribute( $attrName ) == $attrValue ) {
				return $placeholder;
			}
		}
		if ( $this->parentContext instanceof ContextInterface ) {
			return $this->parentContext->searchPlaceholderByNameAndAttr( $name, $attrName, $attrValue );
		}

		return null;
	}

	public function searchParentPlaceholderByName( $name ) {
		if ( $this->getParentPlaceholder() && $this->getParentPlaceholder()->getName() == $name ) {
			return $this->getParentPlaceholder();
		}
		if ( $this->parentContext instanceof ContextInterface ) {
			return $this->parentContext->searchParentPlaceholderByName( $name );
		}

		return null;
	}


}