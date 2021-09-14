<?php


trait Brizy_Editor_Asset_AttachmentAware {
	/**
	 * @param $media_name
	 *
	 * @return null|string
	 */
	private function getAttachmentByMediaName( $media_name ) {

		global $wpdb;

		return $wpdb->get_var( $wpdb->prepare(
			"SELECT 
						p.ID
					FROM {$wpdb->posts} p
						LEFT JOIN {$wpdb->postmeta} m ON ( p.ID = m.post_id )
					WHERE  
						( m.meta_key = 'brizy_attachment_uid' AND m.meta_value = %s )
						AND p.post_type = 'attachment'
						AND p.post_status = 'inherit'
					GROUP BY p.ID
					ORDER BY p.post_date DESC",
			$media_name
		) );
	}
}