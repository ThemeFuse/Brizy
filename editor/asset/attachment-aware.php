<?php


trait Brizy_Editor_Asset_AttachmentAware {
	/**
	 * @param $media_name
	 *
	 * @return null|string
	 */
	private function getAttachmentByMediaName( $media_name ) {

		global $wpdb;

		$posts_table = $wpdb->posts;
		$meta_table  = $wpdb->postmeta;

		return $wpdb->get_var( $wpdb->prepare(
			"SELECT 
						{$posts_table}.ID
					FROM {$posts_table}
						INNER JOIN {$meta_table} ON ( {$posts_table}.ID = {$meta_table}.post_id )
					WHERE 
						( {$meta_table}.meta_key = 'brizy_attachment_uid' 
						AND {$meta_table}.meta_value = %s )
						AND {$posts_table}.post_type = 'attachment'
						AND {$posts_table}.post_status = 'inherit'
					GROUP BY {$posts_table}.ID
					ORDER BY {$posts_table}.post_date DESC",
			$media_name
		) );
	}
}