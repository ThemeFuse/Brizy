<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_PostMetaProtection {

	/**
	 * Matches "brizy", "brizy-*", "brizy_*" and their underscore prefixed variants.
	 * A prefix match is used instead of a key list because migrations and the
	 * importer build meta keys at runtime (ex: brizy-bk-{class}-{version}).
	 */
	const KEY_PATTERN = '/^_?brizy([-_].*)?$/i';

	private static $instance;

	public static function _init() {

		if ( ! self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	private function __construct() {
		add_filter( 'is_protected_meta', array( $this, 'isProtectedMeta' ), 10, 3 );
	}

	/**
	 * @param bool $protected
	 * @param string $metaKey
	 * @param string $metaType
	 *
	 * @return bool
	 */
	public function isProtectedMeta( $protected, $metaKey, $metaType ) {

		if ( $protected || $metaType !== 'post' ) {
			return $protected;
		}

		return (bool) preg_match( self::KEY_PATTERN, (string) $metaKey );
	}
}
