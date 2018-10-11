<?php

class Brizy_Content_Placeholders_ImageAttributes extends Brizy_Content_Placeholders_Simple {

	/**
	 * @return string|callable
	 */
	protected $value;

	/**
	 * Brizy_Editor_Content_GenericPlaceHolder constructor.
	 *
	 * @param string $label
	 * @param string $placeholder
	 * @param string|array $value
	 */
	public function __construct( $label, $placeholder ) {
		$this->label       = $label;
		$this->placeholder = $placeholder;
		$this->value       = function ( Brizy_Content_Context $context, Brizy_Content_ContentPlaceholder $contentPlaceholder ) {
			$attributes = $contentPlaceholder->getAttributes();

			$imageAttributes = "";

			if ( isset( $attributes['uid'] ) ) {
				$imageAttributes = $this->getAttributesByImageUid( $attributes['uid'] );
			} elseif ( isset( $attributes['placeholder'] ) ) {
				$imageAttributes = $this->getAttributesByPlaceholderName( $attributes['placeholder'], $context );
			}

			return $this->buildAttributesString( $imageAttributes );
		};
	}

	/**
	 * @param $placeholderName
	 * @param Brizy_Content_Context $context
	 *
	 * @return array
	 */
	private function getAttributesByPlaceholderName( $placeholderName, Brizy_Content_Context $context ) {

		$attributes = array();

		$provider = $context->getProvider();

		$placeholder = $provider->getPlaceholder( $placeholderName );

		if ( $placeholder instanceof BrizyPro_Content_Placeholders_Image ) {
			$attributes = $placeholder->getImageAttributes( $context );
		}

		return $attributes;
	}

	/**
	 * @param $uid
	 *
	 * @return array
	 */
	private function getAttributesByImageUid( $uid ) {
		global $wpdb;

		$posts_table = $wpdb->posts;
		$meta_table  = $wpdb->postmeta;
		$id          = $wpdb->get_var( $wpdb->prepare(
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


		$attributes = array();

		if ( $id ) {
			$attachment          = get_post( $id );
			$attributes['alt']   = get_post_meta( $id, '_wp_attachment_image_alt', true );
			$attributes['title'] = $attachment->post_title;
		}

		return $attributes;
	}

	/**
	 * @param $attributes
	 *
	 * @return string
	 */
	private function buildAttributesString( $attributes ) {

		if ( count( $attributes ) == 0 ) {
			return "";
		}

		$attrs = array();
		foreach ( $attributes as $key => $value ) {

			if ( $value == '' ) {
				continue;
			}

			$attrs[] = "{$key}=\"{$value}\"";
		}

		return implode( " ", $attrs );
	}
}