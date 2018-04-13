<?php if ( ! defined( 'ABSPATH' ) ) {
	die( 'Direct access forbidden.' );
}

class Brizy_Editor_PostStatus {

	const STATUS_PUBLISH = 'publish';
	const STATUS_FUTURE = 'future';
	const STATUS_DRAFT = 'draft';
	const STATUS_PENDING = 'pending';
	const STATUS_PRIVATE = 'private';
	const STATUS_TRASH = 'trash';
	const STATUS_INHERIT = 'inherit';
	const STATUS_AUTODRAFT = 'auto-draft';

	public static function getStatusFromWpStatus( $wp_status ) {
		switch ( $wp_status ) {
			case 'publish':
				return self::STATUS_PUBLISH;
			case 'future':
				return self::STATUS_FUTURE;
			case 'draft':
				return self::STATUS_DRAFT;
			case 'pending':
				return self::STATUS_PENDING;
			case 'private':
				return self::STATUS_PRIVATE;
			case 'trash':
				return self::STATUS_TRASH;
			case 'inherit':
				return self::STATUS_INHERIT;
			case 'auto-draft':
				return self::STATUS_AUTODRAFT;
		}
	}
}
