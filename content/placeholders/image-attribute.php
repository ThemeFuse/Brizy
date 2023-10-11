<?php

use BrizyPlaceholders\Extractor;

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
		parent::__construct( $label, $placeholder, function ( Brizy_Content_Context $context, \BrizyPlaceholders\ContentPlaceholder $contentPlaceholder ) {
			$attributes = $contentPlaceholder->getAttributes();

			$attachmentId = null;
			if ( isset( $attributes['imageSrc'] ) ) {
				$attachmentId = $this->getAttachmentIdByByUid( $attributes['imageSrc'], $context );
			} elseif ( isset( $attributes['imagePlaceholder'] ) ) {
				$attachmentId = $this->getAttachmentIdByPlaceholderName( $attributes['imagePlaceholder'], $context, $contentPlaceholder );
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
	 * @param \BrizyPlaceholders\ContentPlaceholder $contentPlaceholder
	 *
	 * @return int|mixed|null|string
	 */
	protected function getAttachmentIdByPlaceholderName( $placeholderName, Brizy_Content_Context $context, \BrizyPlaceholders\ContentPlaceholder $contentPlaceholder  ) {

		$provider = $context->getProvider();

		if ( ! $provider ) {
			return 0;
		}

		$extractor = new Extractor( $provider );
		$context->setProvider( $provider );

		list( $contentPlaceholders, $placeholderInstances, $content ) = $extractor->extract( $placeholderName );

		if ( !isset($placeholderInstances[0]) || ! $placeholder = $placeholderInstances[0] ) {
			return 0;
		}

		if ( $placeholder instanceof BrizyPro_Content_Placeholders_Image ) {
			$attachmentId = $placeholder->getAttachmentId( $context, $contentPlaceholder );
		} else {
			$attachmentId = $placeholder->getValue( $context, $contentPlaceholder );
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

		$pt  = $wpdb->posts;
		$mt   = $wpdb->postmeta;
		$attachmentId = $wpdb->get_var( $wpdb->prepare(
			"SELECT 
						{$pt}.ID
					FROM {$pt}
						INNER JOIN {$mt} ON ( {$pt}.ID = {$mt}.post_id )
					WHERE 
						( {$mt}.meta_key = 'brizy_attachment_uid' 
						AND {$mt}.meta_value = %s )
						AND {$pt}.post_type = 'attachment'
					ORDER BY {$pt}.post_date DESC",
			$uid
		) );

		return $attachmentId;
	}

}
