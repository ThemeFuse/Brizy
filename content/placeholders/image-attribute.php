<?php

abstract class Brizy_Content_Placeholders_ImageAttribute extends Brizy_Content_Placeholders_Simple {

	/**
	 * @return string|callable
	 */
	protected $value;

	/**
	 * @param $attachmentId
	 *
	 * @return mixed
	 */
	abstract protected function getAttributeValue( $attachmentId );

	/**
	 * Brizy_Editor_Content_GenericPlaceHolder constructor.
	 *
	 * @param string $label
	 * @param string $placeholder
	 * @param string|array $value
	 */
	public function __construct( $label, $placeholder ) {
		parent::__construct( $label, $placeholder, function ( Brizy_Content_Context $context, Brizy_Content_ContentPlaceholder $contentPlaceholder ) {
			$attributes = $contentPlaceholder->getAttributes();

			$attachmentId = null;
			if ( isset( $attributes['uid'] ) ) {
				$attachmentId = $this->getAttachmentIdByByUid( $attributes['uid'], $context );
			} elseif ( isset( $attributes['placeholder'] ) ) {
				$attachmentId = $this->getAttachmentIdByPlaceholderName( $attributes['placeholder'], $context, $contentPlaceholder );
			}

			if ( $attachmentId ) {
				return $this->getAttributeValue( $attachmentId );
			}

			return '';
		} );
	}


	/**
	 * @param $placeholderName
	 * @param Brizy_Content_Context $context
	 * @param Brizy_Content_ContentPlaceholder $contentPlaceholder
	 *
	 * @return int|mixed|null|string
	 */
	protected function getAttachmentIdByPlaceholderName( $placeholderName, Brizy_Content_Context $context, Brizy_Content_ContentPlaceholder $contentPlaceholder  ) {
		$attachmentId = null;

		$provider = $context->getProvider();

		$placeholder = $provider->getPlaceholder( $placeholderName );

		if ( $placeholder instanceof BrizyPro_Content_Placeholders_Image ) {
			$attachmentId = $placeholder->getAttachmentId( $context, $contentPlaceholder );
		}

		return $attachmentId;
	}

	/**
	 * @param $uid
	 * @param Brizy_Content_Context $context
	 *
	 * @return null|string
	 */
	protected function getAttachmentIdByByUid( $uid, Brizy_Content_Context $context ) {
		global $wpdb;

		$posts_table  = $wpdb->posts;
		$meta_table   = $wpdb->postmeta;
		$attachmentId = $wpdb->get_var( $wpdb->prepare(
			"SELECT 
						{$posts_table}.ID
					FROM {$posts_table}
						INNER JOIN {$meta_table} ON ( {$posts_table}.ID = {$meta_table}.post_id )
					WHERE 
						( {$meta_table}.meta_key = 'brizy_attachment_uid' 
						AND {$meta_table}.meta_value = %s )
						AND {$posts_table}.post_type = 'attachment'
					ORDER BY {$posts_table}.post_date DESC",
			$uid
		) );

		return $attachmentId;
	}

}