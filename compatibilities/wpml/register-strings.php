<?php

class Brizy_Compatibilities_Wpml_RegisterStrings {

	/**
	 * Class instances.
	 *
	 * @see getInstance()
	 * @type array
	 */
	protected static $instance;

	/**
	 * @type WP_Post object
	 */
	private $post;

	/**
	 * @type array object
	 */
	private $package;

	/**
	 * @param WP_Post $post
	 * @param array $package
	 *
	 * @return Brizy_Compatibilities_Wpml_RegisterStrings|null
	 */
	public static function getInstance( $post, $package ) {
		if ( Brizy_Compatibilities_Wpml_Wpml::KIND === $package['kind'] ) {
			return null;
		}

		$postId = $post->ID;

		if ( isset( self::$instance[ $postId ] ) ) {
			return self::$instance[ $postId ];
		}

		self::$instance[ $postId ] = new self( $post, $package );

		return self::$instance[ $postId ];
	}

	/**
	 * @param WP_Post $post
	 * @param array $package
	 *
	 * @return void
	 */
	public function __construct( $post, $package ) {
		$this->post    = $post;
		$this->package = $package;

		$this->registerStrings();
	}

	private function registerStrings() {

		try {
			$items = json_decode( Brizy_Editor_Post::get( $this->post->ID )->get_editor_data(), true );
		} catch ( Exception $e ) {
			return;
		}

		if ( empty( $items['items'] ) ) {
			return;
		}

		$this->registerStringRecursively( $items['items'] );
	}

	private function registerStringRecursively( $items ) {

		foreach ( $items as $item ) {

			$this->doActionRegisterStrings( $item );

			if ( isset( $item['value'] ) && is_array( $item['value'] ) ) {
				$this->doActionRegisterStrings( $item['value'] );

				if ( isset( $item['value']['items'] ) && is_array( $item['value']['items'] ) ) {
					$this->registerStringRecursively( $item['value']['items'] );
				}
			}
		}
	}

	/**
	 * @param array $item
	 *
	 * @return void
	 */
	private function doActionRegisterStrings( $item ) {

		$keys = array_keys( array_intersect_key( $item, array_fill_keys( Brizy_Compatibilities_Wpml_Keys_Abstract::KEYS, '' ) ) );

		foreach ( $keys as $key ) {

			$className = 'Brizy_Compatibilities_Wpml_Keys_' . ucfirst( $key );

			if ( ! class_exists( $className ) ) {
				continue;
			}

			/** @var $instance Brizy_Compatibilities_Wpml_Keys_Abstract */
			$instance = new $className( $item );

			if ( $instance->isValid() ) {

				$value = $instance->getValue();

				if ( is_array( $value ) ) {
					/** @var $string Brizy_Compatibilities_Wpml_Keys_Abstract */
					foreach ( $value as $string ) {
						$this->doActionRegisterString( $string );
					}
				} else {
					$this->doActionRegisterString( $instance );
				}
			}
		}
	}

	/**
	 * @param Brizy_Compatibilities_Wpml_Keys_Abstract $string
	 *
	 * @return void
	 */
	private function doActionRegisterString( $string ) {
		do_action(
			'wpml_register_string',
			$string->getValue(),
			$string->getId(),
			$this->package,
			$string->getName(),
			$string->getType()
		);
	}
}