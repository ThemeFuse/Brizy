<?php

class Brizy_Compatibilities_Wpml_ApplyStrings {

	/**
	 * Class instances.
	 *
	 * @see getInstance()
	 * @type array
	 */
	protected static $instance;

	/**
	 * @type int
	 */
	private $postId;

	/**
	 * @type WP_Post object
	 */
	private $originalPost;

	/**
	 * @type array
	 */
	private $strings;

	/**
	 * @type string
	 */
	private $lang;

	/**
	 * @param string $kind
	 * @param int $postId
	 * @param WP_Post $originalPost
	 * @param array $strings
	 * @param string $lang
	 *
	 * @return Brizy_Compatibilities_Wpml_ApplyStrings|null
	 */
	public static function getInstance( $kind, $postId, $originalPost, $strings, $lang ) {
		if ( Brizy_Compatibilities_Wpml_Wpml::KIND === $kind ) {
			return null;
		}

		if ( isset( self::$instance[ $postId ] ) ) {
			return self::$instance[ $postId ];
		}

		self::$instance[ $postId ] = new self( $postId, $originalPost, $strings, $lang );

		return self::$instance[ $postId ];
	}

	/**
	 * @param int $postId
	 * @param WP_Post $originalPost
	 * @param array $strings
	 * @param string $lang
	 *
	 * @return void
	 */
	public function __construct( $postId, $originalPost, $strings, $lang ) {
		$this->postId       = $postId;
		$this->originalPost = $originalPost;
		$this->strings      = $strings;
		$this->lang         = $lang;

		$this->applyTranslations();
	}

	private function applyTranslations() {

		try {
			$items = json_decode( Brizy_Editor_Post::get( $this->originalPost->ID )->get_editor_data(), true );
		} catch ( Exception $e ) {
			return;
		}

		if ( empty( $items['items'] ) ) {
			return;
		}

		$this->applyTranslationsRecursively( $items );

		try {
			$translatedPost = Brizy_Editor_Post::get( $this->postId );
			$translatedPost->set_editor_data( wp_json_encode( $items ) );
			$translatedPost->set_uses_editor( true );
			$translatedPost->set_needs_compile( true );
			$translatedPost->saveStorage();
			$translatedPost->savePost();
		} catch ( Exception $e ) {
			return;
		}
	}

	private function applyTranslationsRecursively( &$items ) {

		foreach ( $items['items'] as &$item ) {

			$this->addTranslation( $item );

			if ( isset( $item['value'] ) && is_array( $item['value'] ) ) {
				$this->addTranslation( $item['value'] );

				if ( isset( $item['value']['items'] ) && is_array( $item['value']['items'] ) ) {
					$this->applyTranslationsRecursively( $item['value'] );
				}
			}
		}
	}

	/**
	 * @param array $item
	 *
	 * @return void
	 */
	private function addTranslation( &$item ) {

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
					$item[ $key ] = [];
					foreach ( $value as $string ) {
						$item[ $key ][] = $this->strings[ $string->getId() ][ $this->lang ]['value'];
					}
				} else {
					$item[ $key ] = $this->strings[ $instance->getId() ][ $this->lang ]['value'];
				}
			}
		}
	}
}